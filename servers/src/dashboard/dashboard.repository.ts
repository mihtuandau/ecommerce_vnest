import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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
        status: 'DELIVERED',
        payment: { status: { in: ['SUCCESS', 'REFUNDED'] } }
      },
      _sum: { 
        subtotal: true,
        discountAmount: true
      },
    });
    
    // Lấy tổng hoàn tiền từ bảng Payment
    const refundData = await this.prisma.payment.aggregate({
      where: {
        order: { status: 'DELIVERED' },
        status: { in: ['SUCCESS', 'REFUNDED'] }
      },
      _sum: { refundAmount: true }
    });

    const net = (Number(data._sum.subtotal) || 0) - (Number(data._sum.discountAmount) || 0);
    const refund = Number(refundData._sum.refundAmount) || 0;
    return net - refund;
  }

  
  async getRevenueByDate(date: Date): Promise<number> {
    const vnDate = dayjs(date).tz('Asia/Ho_Chi_Minh');
    const start = vnDate.startOf('day').toDate();
    const end = vnDate.endOf('day').toDate();

    const data = await this.prisma.order.aggregate({
      where: {
        status: 'DELIVERED',
        createdAt: { gte: start, lte: end },
        payment: { status: { in: ['SUCCESS', 'REFUNDED'] } }
      },
      _sum: { 
        subtotal: true,
        discountAmount: true
      },
    });

    const refundData = await this.prisma.payment.aggregate({
      where: {
        order: {
          status: 'DELIVERED',
          createdAt: { gte: start, lte: end }
        },
        status: { in: ['SUCCESS', 'REFUNDED'] }
      },
      _sum: { refundAmount: true }
    });

    const net = (Number(data._sum.subtotal) || 0) - (Number(data._sum.discountAmount) || 0);
    const refund = Number(refundData._sum.refundAmount) || 0;
    return net - refund;
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
    const vnDate = dayjs(date).tz('Asia/Ho_Chi_Minh');
    const start = vnDate.startOf('day').toDate();
    const end = vnDate.endOf('day').toDate();

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
    const startOfYear = dayjs().tz('Asia/Ho_Chi_Minh').year(year).startOf('year').toDate();
    const endOfYear = dayjs().tz('Asia/Ho_Chi_Minh').year(year).endOf('year').toDate();

    return this.prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        subtotal: true,
        discountAmount: true,
        payment: {
          select: { refundAmount: true }
        },
        createdAt: true
      }
    });
  }

  
  async getDailyRevenue(year: number, month: number) {
    const startOfMonth = dayjs().tz('Asia/Ho_Chi_Minh').year(year).month(month).startOf('month').toDate();
    const endOfMonth = dayjs().tz('Asia/Ho_Chi_Minh').year(year).month(month).endOf('month').toDate();

    return this.prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        subtotal: true,
        discountAmount: true,
        payment: {
          select: { refundAmount: true }
        },
        createdAt: true
      }
    });
  }

  
  async getRevenueByDateRange(start: Date, end: Date) {
    return this.prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: { gte: start, lte: end },
        payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
      },
      select: {
        subtotal: true,
        discountAmount: true,
        payment: {
          select: { refundAmount: true }
        },
        createdAt: true
      },
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
            phone: true,
          },
        },
        orderItems: {
          take: 1,
          include: {
            variant: {
              include: {
                images: {
                  take: 1,
                  orderBy: { isPrimary: 'desc' }
                },
                product: {
                  include: {
                    images: {
                      take: 1,
                      orderBy: { isThumbnail: 'desc' }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });
  }

  
  async getAllOrderItemsWithProducts() {
    return this.prisma.orderItem.findMany({
      where: {
        order: {
          status: 'DELIVERED',
          payment: { status: { in: ['SUCCESS', 'REFUNDED'] } },
        },
      },
      include: {
        order: {
          select: {
            total: true,
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


