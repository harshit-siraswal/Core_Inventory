import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from './dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import type { JwtPayload } from './strategies/jwt.strategy';
import { parseJwtExpiresInToMilliseconds } from './utils/jwt-expiry.util';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const refreshMaxAge = parseJwtExpiresInToMilliseconds(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      7 * 24 * 60 * 60 * 1000,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: refreshMaxAge,
      path: '/api/v1/auth',
    });
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.data.refreshToken);

    return {
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken,
      },
    };
  }

  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(ForgotPasswordSchema))
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, result.data.refreshToken);

    return {
      data: {
        accessToken: result.data.accessToken,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.sub);
  }
}
