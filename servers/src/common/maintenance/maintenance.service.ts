import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Recalculates soldCount for all products based on actual order items from DELIVERED orders.
   * This fixes any inconsistencies caused by application-level transaction failures.
   */
  async syncSoldCount() {
    this.logger.log('Starting soldCount synchronization...');
    
    // 1. Reset all soldCount to 0
    await this.prisma.product.updateMany({
      data: { soldCount: 0 }
    });

    // 2. Aggregate quantity from DELIVERED or RETURN_REQUESTED orders
    const stats = await this.prisma.orderItem.groupBy({
      by: ['variantId'],
      where: {
        order: {
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] }
        }
      },
      _sum: {
        quantity: true
      }
    });

    // We also need to subtract returned items
    const returnedStats = await this.prisma.returnItem.groupBy({
      by: ['orderItemId'],
      where: {
        returnRequest: {
          status: { in: ['RECEIVED', 'COMPLETED'] }
        }
      },
      _sum: {
        quantity: true
      }
    });

    // Map variant to product
    const variants = await this.prisma.productVariant.findMany({
      select: { id: true, productId: true }
    });
    const variantToProduct = new Map(variants.map(v => [v.id, v.productId]));

    // Map orderItem to variant
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] }
        }
      },
      select: { id: true, variantId: true }
    });
    const orderItemToVariant = new Map(orderItems.map(oi => [oi.id, oi.variantId]));

    const productSales = new Map<number, number>();

    // Add sales
    for (const stat of stats) {
      const productId = variantToProduct.get(stat.variantId);
      if (productId) {
        const current = productSales.get(productId) || 0;
        productSales.set(productId, current + (stat._sum.quantity || 0));
      }
    }

    // Subtract returns
    for (const ret of returnedStats) {
      const variantId = orderItemToVariant.get(ret.orderItemId);
      if (variantId) {
        const productId = variantToProduct.get(variantId);
        if (productId) {
          const current = productSales.get(productId) || 0;
          productSales.set(productId, Math.max(0, current - (ret._sum.quantity || 0)));
        }
      }
    }

    // 3. Update products
    let updatedCount = 0;
    for (const [productId, soldCount] of productSales.entries()) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { soldCount }
      });
      updatedCount++;
    }

    this.logger.log(`Synchronization completed. Updated ${updatedCount} products.`);
    return { updatedCount };
  }

  /**
   * Recalculates averageRating and reviewCount for all products based on verified reviews.
   */
  async syncRatings() {
    this.logger.log('Starting rating synchronization...');

    // 1. Reset all stats (Default to 0 instead of null for better UI consistency)
    await this.prisma.product.updateMany({
      data: { averageRating: 0, reviewCount: 0 }
    });

    // 2. Aggregate reviews
    const stats = await this.prisma.review.groupBy({
      by: ['productId'],
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      }
    });

    // 3. Update products
    let updatedCount = 0;
    for (const stat of stats) {
      await this.prisma.product.update({
        where: { id: stat.productId },
        data: {
          averageRating: stat._avg.rating,
          reviewCount: stat._count._all
        }
      });
      updatedCount++;
    }

    this.logger.log(`Rating synchronization completed. Updated ${updatedCount} products.`);
    return { updatedCount };
  }
}
