import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Repository pattern for Dashboard data access
 * Handles all database queries related to dashboard statistics
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
   * Get total revenue from delivered orders
   */
  async getTotalRevenue(): Promise<number> {
    const revenueData = await this.prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    });
    return Number(revenueData._sum.total) || 0;
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
   * Get monthly revenue for a specific year
   */
  async getMonthlyRevenue(year: number) {
    return this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59),
        },
      },
      _sum: { total: true },
    });
  }

  /**
   * Get daily revenue for a specific month
   */
  async getDailyRevenue(year: number, month: number) {
    return this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0, 23, 59, 59),
        },
      },
      _sum: { total: true },
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
      include: {
        variant: {
          include: {
            product: {
              include: {
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
