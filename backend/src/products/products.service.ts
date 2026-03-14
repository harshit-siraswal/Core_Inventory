import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

type ProductPaginationOptions = {
  page?: number;
  limit?: number;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existing) {
      throw new ConflictException('Product with this SKU already exists');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      return await this.prisma.product.create({
        data: createProductDto,
        include: { category: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Product with this SKU already exists');
      }
      throw error;
    }
  }

  async findAll(options: ProductPaginationOptions = {}) {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(Math.max(1, options.limit ?? 20), 100);
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: pageSize,
        include: { category: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count(),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: { category: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Product with this SKU already exists');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const stockCount = await tx.stock.count({
          where: { productId: id, quantity: { gt: 0 } },
        });

        if (stockCount > 0) {
          throw new ConflictException(
            'Cannot delete product with active stock. Consider setting status to DISCONTINUED.',
          );
        }

        return tx.product.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }

        if (error.code === 'P2003') {
          throw new ConflictException(
            'Cannot delete product because related stock records exist.',
          );
        }
      }

      throw error;
    }
  }
}
