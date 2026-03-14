import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateLocationDto } from './dto/create-location.dto';
import type { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    const existing = await this.prisma.location.findUnique({
      where: { code: createLocationDto.code },
    });

    if (existing) {
      throw new ConflictException('Location with this code already exists');
    }

    try {
      return await this.prisma.location.create({
        data: createLocationDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Location with this code already exists');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 50) {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(Math.max(1, limit), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.location.findMany({
        skip,
        take: normalizedLimit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.location.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
      },
    };
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id); // Ensure exists

    if (updateLocationDto.code) {
      const existing = await this.prisma.location.findUnique({
        where: { code: updateLocationDto.code },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Location with this code already exists');
      }
    }

    try {
      return await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Location with this code already exists');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Location not found');
        }
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.location.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Cannot delete location with active stock. Consider setting status to INACTIVE.',
          );
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Location not found');
        }
      }

      throw error;
    }
  }
}
