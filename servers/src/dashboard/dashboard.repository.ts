import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) {}

  
  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  
  async getTotalCustomers(): Promise<number> {
    return this.prisma.user.count({ where: { role: 'CUSTOMER' } });
  }

  
  async getTotalProducts(): Promise<number> {
    return this.prisma.product.count();
  }

  
  async getTotalCategories(): Promise<number> {
    return this.prisma.category.count();
  }

  
  async getTotalOrders(): Promise<number> {
    return this.prisma.order.count();
  }

  
  async getOrderCountByStatus(status: any): Promise<number> {
    return this.prisma.order.count({ where: { status } });
  }

  
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

  
  async getLowStockCount(threshold: number = 10): Promise<number> {
    return this.prisma.productVariant.count({
      where: { stock: { lt: threshold } },
    });
  }

  
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






