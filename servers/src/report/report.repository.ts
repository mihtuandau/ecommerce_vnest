import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async getRevenueByDate(startDate: Date, endDate: Date) {
    return this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'DELIVERED',
      },
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getRevenueByMonth(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    return this.prisma.$queryRaw<
      Array<{ month: number; revenue: number; orders: number }>
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        SUM("total")::float as revenue,
        COUNT(*)::int as orders
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status = 'DELIVERED'
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month ASC
    `;
  }

  async getRevenueByYear(startYear: number, endYear: number) {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31, 23, 59, 59);

    return this.prisma.$queryRaw<
      Array<{ year: number; revenue: number; orders: number }>
    >`
      SELECT 
        EXTRACT(YEAR FROM "createdAt")::int as year,
        SUM("total")::float as revenue,
        COUNT(*)::int as orders
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status = 'DELIVERED'
      GROUP BY EXTRACT(YEAR FROM "createdAt")
      ORDER BY year ASC
    `;
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
      WHERE o."createdAt" >= ${startDate}
        AND o."createdAt" <= ${endDate}
        AND o.status = 'DELIVERED'
      GROUP BY pv."productId", p.name
      ORDER BY "totalRevenue" DESC
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
      WHERE o."createdAt" >= ${startDate}
        AND o."createdAt" <= ${endDate}
        AND o.status = 'DELIVERED'
      GROUP BY p."categoryId", c.name
      ORDER BY "totalRevenue" DESC
      LIMIT ${limit}
    `;
  }

  async getCustomerStats(startDate: Date, endDate: Date) {
    const [newCustomers, returningCustomers, totalOrdersInPeriod] =
      await Promise.all([
        // New customers (created in period)
        this.prisma.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        // Returning customers (had orders before period and also in period)
        this.prisma.$queryRaw<Array<{ count: number }>>`
          SELECT COUNT(DISTINCT o."userId")::int as count
          FROM "Order" o
          WHERE o."userId" IN (
            SELECT "userId" FROM "Order" 
            WHERE "createdAt" < ${startDate}
          )
          AND o."createdAt" >= ${startDate}
          AND o."createdAt" <= ${endDate}
        `.then((result) => result[0]?.count || 0),
        // Total orders in period
        this.prisma.order.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
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
          status: 'DELIVERED',
        },
        _sum: {
          total: true,
        },
      }),
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: previousStart,
            lte: previousEnd,
          },
          status: 'DELIVERED',
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    const current = currentRevenue._sum?.total || 0;
    const previous = previousRevenue._sum?.total || 0;
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      current,
      previous,
      change: parseFloat(change.toFixed(2)),
    };
  }
}
