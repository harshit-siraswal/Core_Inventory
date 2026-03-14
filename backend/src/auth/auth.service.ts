import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'node:crypto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import { parseJwtExpiresInToSeconds } from './utils/jwt-expiry.util';

type OtpRecord = {
  hash: string;
  expiresAt: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly passwordResetOtpStore = new Map<string, OtpRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          role: 'STAFF',
          status: 'ACTIVE',
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('email')
      ) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }
      throw error;
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        ...tokens,
      },
    };
  }

  async login(dto: LoginDto) {
    const timestamp = new Date().toISOString();
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      this.logger.warn(
        JSON.stringify({
          event: 'auth.login.failure',
          reason: 'invalid_credentials',
          timestamp,
        }),
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      this.logger.warn(
        JSON.stringify({
          event: 'auth.login.failure',
          reason: 'account_inactive',
          userId: user.id,
          timestamp,
        }),
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      this.logger.warn(
        JSON.stringify({
          event: 'auth.login.failure',
          reason: 'invalid_credentials',
          userId: user.id,
          timestamp,
        }),
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(
      JSON.stringify({
        event: 'auth.login.success',
        userId: user.id,
        timestamp,
      }),
    );

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        ...tokens,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { data: user };
  }

  async forgotPassword(dto: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      // Return success even if not found to prevent email enumeration
      return {
        message: 'If an account exists, a reset link/OTP has been sent.',
      };
    }

    const otp = randomInt(100000, 1000000).toString();
    const ttlSeconds = 10 * 60;
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.passwordResetOtpStore.set(user.email, {
      hash: this.hashOtp(otp),
      expiresAt,
    });

    // Placeholder for mailer integration: keep generic success response regardless.
    this.logger.log(
      JSON.stringify({
        event: 'auth.password_reset.otp.generated',
        userId: user.id,
        timestamp: new Date().toISOString(),
      }),
    );

    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.debug(`Generated OTP for ${user.id}: ${otp}`);
    }

    return { message: 'If an account exists, a reset link/OTP has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = this.passwordResetOtpStore.get(dto.email);
    if (!record) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (Date.now() > record.expiresAt) {
      this.passwordResetOtpStore.delete(dto.email);
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const otpMatches = this.hashOtp(dto.otp) === record.hash;
    if (!otpMatches) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (!dto.newPassword) {
      throw new BadRequestException('New password is required');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    this.passwordResetOtpStore.delete(dto.email);

    return { message: 'Password has been reset successfully' };
  }

  async refresh(refreshToken: string) {
    const timestamp = new Date().toISOString();

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        role: Role;
        type?: string;
      }>(refreshToken, {
        secret: this.getRefreshSecret(),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          refreshTokenHash: true,
        },
      });

      if (!user || user.status !== 'ACTIVE' || !user.refreshTokenHash) {
        this.logger.warn(
          JSON.stringify({
            event: 'auth.refresh.failure',
            reason: 'invalid_token_state',
            userId: payload.sub,
            timestamp,
          }),
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash,
      );
      if (!refreshTokenValid) {
        this.logger.warn(
          JSON.stringify({
            event: 'auth.refresh.failure',
            reason: 'token_mismatch',
            userId: user.id,
            timestamp,
          }),
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.role);
      this.logger.log(
        JSON.stringify({
          event: 'auth.refresh.success',
          userId: user.id,
          timestamp,
        }),
      );

      return { data: tokens };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.warn(
        JSON.stringify({
          event: 'auth.refresh.failure',
          reason: 'verification_failed',
          timestamp,
        }),
      );
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, role: Role) {
    const payload = { sub: userId, role };
    const accessExpiresIn = parseJwtExpiresInToSeconds(
      this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      15 * 60,
    );
    const refreshExpiresIn = parseJwtExpiresInToSeconds(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      7 * 24 * 60 * 60,
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: accessExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: this.getRefreshSecret(),
        expiresIn: refreshExpiresIn,
      },
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: await bcrypt.hash(refreshToken, 12),
      },
    });

    return { accessToken, refreshToken };
  }

  private getRefreshSecret() {
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    if (refreshSecret) {
      return refreshSecret;
    }

    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.warn(
        'JWT_REFRESH_SECRET is not set. Falling back to JWT_SECRET. Configure a dedicated JWT_REFRESH_SECRET.',
      );
    }

    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }
}
