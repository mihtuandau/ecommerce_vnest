import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Repository pattern for Dashboard data access
 * Handles all database queries related to dashboard statistics
 * Revenue is sourced from Order.subtotal (Tiền hàng) as requested by user
 */
@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Get total count of users
   */
  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  /**
   * Get total count of customers
   */
  async getTotalCustomers(): Promise<number> {
    return this.prisma.user.count({ where: { role: 'CUSTOMER' } });
  }

  /**
   * Get total count of products
   */
  async getTotalProducts(): Promise<number> {
    return this.prisma.product.count();
  }

  /**
   * Get total count of categories
   */
  async getTotalCategories(): Promise<number> {
    return this.prisma.category.count();
  }

  /**
   * Get total count of orders
   */
  async getTotalOrders(): Promise<number> {
    return this.prisma.order.count();
  }

  /**
   * Get count of orders by status
   */
  async getOrderCountByStatus(status: any): Promise<number> {
    return this.prisma.order.count({ where: { status } });
  }

  /**
   * Get total revenue (Sourced from Order.subtotal)
   * Only success payments, non-cancelled orders
   */
  async getTotalRevenue(): Promise<number> {
    const data = await this.prisma.order.aggregate({
      where: { 
        status: { not: 'CANCELLED' },
        payment: { status: 'SUCCESS' }
      },
      _sum: { subtotal: true },
    });
    return Number(data._sum.subtotal) || 0;
  }

  /**
   * Get revenue by date (Sourced from Order.subtotal, grouped by Order Date)
   */
  async getRevenueByDate(date: Date): Promise<number> {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    const data = await this.prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: start, lte: end },
        payment: { status: 'SUCCESS' },
      },
      _sum: { subtotal: true },
    });
    return Number(data._sum.subtotal) || 0;
  }

  /**
   * Get count of new users by date
   */
  async getNewUsersCount(date: Date): Promise<number> {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    return this.prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        deletedAt: null,
      },
    });
  }

  /**
   * Get order count by date
   */
  async getOrderCountByDate(date: Date): Promise<number> {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    return this.prisma.order.count({
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' }
      },
    });
  }

  /**
   * Get count of low stock products
   */
  async getLowStockCount(threshold: number = 10): Promise<number> {
    return this.prisma.productVariant.count({
      where: { stock: { lt: threshold } },
    });
  }

  /**
   * Get monthly revenue records (Sourced from Order.subtotal)
   */
  async getMonthlyRevenue(year: number) {
    return this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        payment: { status: 'SUCCESS' },
        createdAt: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59),
        },
      },
      select: {
        subtotal: true,
        createdAt: true
      }
    });
  }

  /**
   * Get daily revenue records (Sourced from Order.subtotal)
   */
  async getDailyRevenue(year: number, month: number) {
    return this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        payment: { status: 'SUCCESS' },
        createdAt: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0, 23, 59, 59),
        },
      },
      select: {
        subtotal: true,
        createdAt: true
      }
    });
  }

  /**
   * Get revenue records by date range (Sourced from Order.subtotal)
   */
  async getRevenueByDateRange(start: Date, end: Date) {
    return this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        payment: { status: 'SUCCESS' },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        subtotal: true,
        createdAt: true
      }
    });
  }

  /**
   * Get recent orders with user information
   */
  async getRecentOrders(limit: number) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all order items with product information
   */
  async getAllOrderItemsWithProducts() {
    return this.prisma.orderItem.findMany({
      where: {
        order: {
          status: { not: 'CANCELLED' },
          payment: { status: 'SUCCESS' },
        },
      },
      include: {
        order: {
          select: {
            subtotal: true,
            discountAmount: true,
          },
        },
        variant: {
          include: {
            product: {
              include: {
                images: true,
                category: { select: { name: true } },
                brand: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }
}
