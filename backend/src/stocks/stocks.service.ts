import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(Math.max(1, limit), 100);
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.stock.findMany({
        skip,
        take: normalizedLimit,
        include: {
          product: true,
          location: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.stock.count(),
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

  async findByProduct(productId: string) {
    return this.prisma.stock.findMany({
      where: { productId },
      include: { location: true },
    });
  }

  async findByLocation(locationId: string) {
    return this.prisma.stock.findMany({
      where: { locationId },
      include: { product: true },
    });
  }

  async adjustStock(userId: string, adjustStockDto: AdjustStockDto) {
    const { productId, locationId, quantityChange, reason } = adjustStockDto;

    if (quantityChange === 0) {
      throw new BadRequestException('Quantity change cannot be zero');
    }

    // Perform inside a transaction to ensure stock and ledger stay perfectly in sync
    return this.prisma.$transaction(async (tx) => {
      const [product, location] = await Promise.all([
        tx.product.findUnique({ where: { id: productId }, select: { id: true } }),
        tx.location.findUnique({
          where: { id: locationId },
          select: { id: true },
        }),
      ]);

      if (!product) throw new NotFoundException('Product not found');
      if (!location) throw new NotFoundException('Location not found');

      const now = new Date();

      // Find or create the stock record (UPSERT)
      // Prisma does not allow upserting and throwing an error if quantity falls below 0 in one go easily,
      // so we find it, check, and update/create.
      let stock = await tx.stock.findFirst({
        where: { productId, locationId },
      });

      if (!stock) {
        if (quantityChange < 0) {
          throw new BadRequestException(
            'Cannot reduce stock below zero, stock record does not exist.',
          );
        }
        stock = await tx.stock.create({
          data: {
            productId,
            locationId,
            quantity: quantityChange,
            lastCalculatedDate: now,
          },
        });
      } else {
        const newQuantity = stock.quantity + quantityChange;
        if (newQuantity < 0) {
          throw new BadRequestException(
            `Insufficient stock. Current: ${stock.quantity}, Attempted change: ${quantityChange}`,
          );
        }
        stock = await tx.stock.update({
          where: { id: stock.id },
          data: {
            quantity: newQuantity,
            lastCalculatedDate: now,
          },
        });
      }

      const adjustmentTransaction = await tx.transaction.create({
        data: {
          type: 'ADJUSTMENT',
          status: 'COMPLETED',
          referenceNo: `adj-${randomUUID()}`,
          createdById: userId,
          notes: reason,
        },
      });

      // Record the transaction action in the ledger
      await tx.stockMove.create({
        data: {
          productId,
          locationId,
          transactionId: adjustmentTransaction.id,
          quantity: quantityChange,
          date: now,
        },
      });

      return stock;
    });
  }
}
