import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

type CategoryPaginationOptions = {
  page?: number;
  limit?: number;
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async findAll(options: CategoryPaginationOptions = {}) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Category with this name already exists');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Cannot delete category with associated products',
          );
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }

      throw error;
    }
  }
}
