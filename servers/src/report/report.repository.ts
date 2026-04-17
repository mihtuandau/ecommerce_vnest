import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async getRawOrdersForRevenue(startDate: Date, endDate: Date) {
    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'CANCELLED' },
        payment: { status: 'SUCCESS' },
      },
      select: {
        subtotal: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getOrdersByStatus(startDate: Date, endDate: Date) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
    });
  }

  async getTopProducts(startDate: Date, endDate: Date, limit: number = 10) {
    return this.prisma.$queryRaw<
      Array<{
        productId: number;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
      }>
    >`
      SELECT 
        pv."productId",
        p.name as "productName",
        SUM(oi.quantity)::int as "totalQuantity",
        SUM(oi.price * oi.quantity)::float as "totalRevenue"
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON pv.id = oi."variantId"
      JOIN "Product" p ON p.id = pv."productId"
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Payment" pay ON pay."orderId" = o.id
      WHERE o."createdAt" >= ${startDate}
        AND o."createdAt" <= ${endDate}
        AND pay.status = 'SUCCESS'
        AND o.status != 'CANCELLED'
      GROUP BY pv."productId", p.name
      ORDER BY "totalQuantity" DESC
      LIMIT ${limit}
    `;
  }

  async getTopCategories(startDate: Date, endDate: Date, limit: number = 10) {
    return this.prisma.$queryRaw<
      Array<{
        categoryId: number;
        categoryName: string;
        totalOrders: number;
        totalRevenue: number;
      }>
    >`
      SELECT 
        p."categoryId",
        c.name as "categoryName",
        COUNT(DISTINCT oi."orderId")::int as "totalOrders",
        SUM(oi.price * oi.quantity)::float as "totalRevenue"
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON pv.id = oi."variantId"
      JOIN "Product" p ON p.id = pv."productId"
      JOIN "Category" c ON c.id = p."categoryId"
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Payment" pay ON pay."orderId" = o.id
      WHERE o."createdAt" >= ${startDate}
        AND o."createdAt" <= ${endDate}
        AND pay.status = 'SUCCESS'
        AND o.status != 'CANCELLED'
      GROUP BY p."categoryId", c.name
      ORDER BY "totalRevenue" DESC
      LIMIT ${limit}
    `;
  }

  async getCustomerStats(startDate: Date, endDate: Date) {
    const [newCustomers, returningCustomers, totalOrdersInPeriod] =
      await Promise.all([
        this.prisma.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        this.prisma.$queryRaw<Array<{ count: number }>>`
          SELECT COUNT(DISTINCT o."userId")::int as count
          FROM "Order" o
          WHERE o."userId" IN (
            SELECT "userId" FROM "Order" 
            WHERE "createdAt" < ${startDate}
          )
          AND o."createdAt" >= ${startDate}
          AND o."createdAt" <= ${endDate}
          AND o.status != 'CANCELLED'
        `.then((result) => result[0]?.count || 0),
        this.prisma.order.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            status: { not: 'CANCELLED' },
            payment: { status: 'SUCCESS' }
          },
        }),
      ]);

    return {
      newCustomers,
      returningCustomers,
      totalOrders: totalOrdersInPeriod,
    };
  }

  async getRevenueComparison(currentStart: Date, currentEnd: Date) {
    const duration = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - duration);
    const previousEnd = new Date(currentStart.getTime() - 1);

    const [currentRevenue, previousRevenue] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: currentStart,
            lte: currentEnd,
          },
          status: { not: 'CANCELLED' },
          payment: { status: 'SUCCESS' },
        },
        _sum: {
          subtotal: true,
        },
      }),
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: previousStart,
            lte: previousEnd,
          },
          status: { not: 'CANCELLED' },
          payment: { status: 'SUCCESS' },
        },
        _sum: {
          subtotal: true,
        },
      }),
    ]);

    const current = currentRevenue._sum?.subtotal || 0;
    const previous = previousRevenue._sum?.subtotal || 0;
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      current,
      previous,
      change: parseFloat(change.toFixed(2)),
    };
  }
}






