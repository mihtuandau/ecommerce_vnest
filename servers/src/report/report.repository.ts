import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async getRawOrdersForRevenue(startDate: Date, endDate: Date) {
    return this.prisma.order.findMany({
      where: {
        status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
        payment: {
          status: 'SUCCESS',
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      select: {
        subtotal: true,
        discountAmount: true,
        createdAt: true,
        payment: { select: { updatedAt: true } },
      },
      orderBy: { payment: { updatedAt: 'asc' } },
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
        image: string;
      }>
    >`
      SELECT 
        p.id as "productId",
        p.name as "productName",
        SUM(oi.quantity)::int as "totalQuantity",
        SUM(
          (oi.price * oi.quantity) * (NULLIF(o.subtotal - o."discountAmount", 0) / NULLIF(o.subtotal, 0))
        )::float as "totalRevenue",
        (SELECT url FROM "ProductImage" WHERE "productId" = p.id AND "isThumbnail" = true LIMIT 1) as "image"
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Payment" pay ON pay."orderId" = o.id
      JOIN "ProductVariant" pv ON pv.id = oi."variantId"
      JOIN "Product" p ON p.id = pv."productId"
      WHERE o.status IN ('DELIVERED', 'RETURN_REQUESTED') 
        AND pay.status = 'SUCCESS'
        AND pay."updatedAt" >= ${startDate}
        AND pay."updatedAt" <= ${endDate}
      GROUP BY p.id, p.name
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
        SUM(
          (oi.price * oi.quantity) * (NULLIF(o.subtotal - o."discountAmount", 0) / NULLIF(o.subtotal, 0))
        )::float as "totalRevenue"
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Payment" pay ON pay."orderId" = o.id
      JOIN "ProductVariant" pv ON pv.id = oi."variantId"
      JOIN "Product" p ON p.id = pv."productId"
      JOIN "Category" c ON c.id = p."categoryId"
      WHERE o.status IN ('DELIVERED', 'RETURN_REQUESTED') 
        AND pay.status = 'SUCCESS'
        AND pay."updatedAt" >= ${startDate}
        AND pay."updatedAt" <= ${endDate}
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
          JOIN "Payment" p ON p."orderId" = o.id
          WHERE o."userId" IN (
            SELECT "userId" FROM "Order" 
            WHERE "createdAt" < ${startDate}
          )
          AND o."createdAt" >= ${startDate}
          AND o."createdAt" <= ${endDate}
          AND o.status = 'DELIVERED'
          AND p.status IN ('SUCCESS', 'REFUNDED')
        `.then((result) => result[0]?.count || 0),
        this.prisma.order.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            status: { in: ['DELIVERED', 'RETURNED', 'RETURN_REQUESTED'] },
            payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
          },
        }),
      ]);

    // 4. Đếm khách vãng lai mới trong kỳ (Dựa trên Email duy nhất chưa từng mua trước đó)
    const newGuestCount = await this.prisma.order
      .groupBy({
        by: ['guestEmail'],
        where: {
          userId: null,
          guestEmail: { not: null },
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'RETURNED', 'RETURN_REQUESTED'] },
        },
      })
      .then((res) => res.length);

    return {
      newCustomers: newCustomers + newGuestCount,
      returningCustomers,
      totalOrders: totalOrdersInPeriod,
    };
  }

  async getProductStats() {
    const [total, active] = await Promise.all([
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { isActive: true, deletedAt: null } }),
    ]);
    return { total, active };
  }

  async getCustomerGrowth(startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - duration);
    const previousEnd = new Date(startDate.getTime() - 1);

    const [absoluteTotal, currentPeriod, previousPeriod] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER', deletedAt: null } }),
      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: previousStart, lte: previousEnd },
        },
      }),
    ]);

    const growth =
      previousPeriod > 0
        ? ((currentPeriod - previousPeriod) / previousPeriod) * 100
        : 0;

    return {
      total: absoluteTotal,
      periodTotal: currentPeriod,
      growth: parseFloat(growth.toFixed(2)),
    };
  }

  async getOrdersComparison(startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - duration);
    const previousEnd = new Date(startDate.getTime() - 1);

    const [absoluteTotal, currentPeriod, previousPeriod] = await Promise.all([
      this.prisma.order.count({
        where: {
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: previousStart, lte: previousEnd },
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      }),
    ]);

    console.log(
      `[ReportDebug] Orders count: Total=${absoluteTotal}, Period=${currentPeriod}`,
    );

    const growth =
      previousPeriod > 0
        ? ((currentPeriod - previousPeriod) / previousPeriod) * 100
        : 0;

    return {
      total: absoluteTotal,
      periodTotal: currentPeriod,
      growth: parseFloat(growth.toFixed(2)),
    };
  }

  async getTodayOrders() {
    const vnNow = dayjs().tz('Asia/Ho_Chi_Minh');
    const startOfToday = vnNow.startOf('day').toDate();
    const endOfToday = vnNow.endOf('day').toDate();
    const startOfYesterday = vnNow.subtract(1, 'day').startOf('day').toDate();
    const endOfYesterday = vnNow.subtract(1, 'day').endOf('day').toDate();

    const [todayCount, yesterdayCount] = await Promise.all([
      this.prisma.order.count({
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday },
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: startOfYesterday, lte: endOfYesterday },
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      }),
    ]);

    const change =
      yesterdayCount > 0
        ? ((todayCount - yesterdayCount) / yesterdayCount) * 100
        : 0;

    return {
      today: todayCount,
      change: parseFloat(change.toFixed(1)),
    };
  }

  async getRevenueComparison(currentStart: Date, currentEnd: Date) {
    const duration = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - duration);
    const previousEnd = new Date(currentStart.getTime() - 1);

    // We need to sum order subtotal - discount instead
    const getNetSales = async (s: Date, e: Date) => {
      const d = await this.prisma.order.aggregate({
        where: {
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: {
            status: 'SUCCESS',
            updatedAt: { gte: s, lte: e },
          },
        },
        _sum: { subtotal: true, discountAmount: true },
      });
      return (
        (Number(d._sum.subtotal) || 0) - (Number(d._sum.discountAmount) || 0)
      );
    };

    const current = await getNetSales(currentStart, currentEnd);
    const previous = await getNetSales(previousStart, previousEnd);
    const absolute = await this.prisma.order
      .aggregate({
        where: {
          status: { in: ['DELIVERED', 'RETURN_REQUESTED'] },
          payment: { status: 'SUCCESS' },
        },
        _sum: { subtotal: true, discountAmount: true },
      })
      .then(
        (d) =>
          (Number(d._sum.subtotal) || 0) - (Number(d._sum.discountAmount) || 0),
      );
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      total: current,
      absoluteTotal: absolute,
      growth: parseFloat(growth.toFixed(2)),
    };
  }

  async getDetailedOrders(startDate: Date, endDate: Date) {
    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        guestEmail: true,
        guestPhone: true,
        shippingSnapshot: true,
        orderCode: true,
        subtotal: true,
        discountAmount: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
            refundAmount: true,
            transactionId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
