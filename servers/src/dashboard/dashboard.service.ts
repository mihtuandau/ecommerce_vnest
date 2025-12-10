import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

/**
 * Service layer for dashboard business logic
 * Orchestrates data from repository and applies business rules
 */
@Injectable()
export class DashboardService {
  constructor(private repository: DashboardRepository) {}

  async getStats() {
    // Get all data from repository
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      totalRevenue,
      lowStockCount,
    ] = await Promise.all([
      this.repository.getTotalUsers(),
      this.repository.getTotalProducts(),
      this.repository.getTotalCategories(),
      this.repository.getTotalOrders(),
      this.repository.getOrderCountByStatus('PENDING'),
      this.repository.getOrderCountByStatus('DELIVERED'),
      this.repository.getTotalCustomers(),
      this.repository.getTotalRevenue(),
      this.repository.getLowStockCount(10),
    ]);

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
        admins: totalUsers - totalCustomers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockCount,
      },
      categories: {
        total: totalCategories,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
      },
      revenue: {
        total: totalRevenue,
        currency: 'VND',
      },
    };
  }

  async getRevenueAnalytics() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get revenue by month for current year from repository
    const monthlyRevenue = await this.repository.getMonthlyRevenue(currentYear);

    // Process monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
      orders: 0,
    }));

    monthlyRevenue.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      monthlyData[month].revenue += Number(item._sum.total) || 0;
      monthlyData[month].orders += 1;
    });

    // Get daily revenue for current month from repository
    const dailyRevenue = await this.repository.getDailyRevenue(
      currentYear,
      currentMonth,
    );

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      revenue: 0,
      orders: 0,
    }));

    dailyRevenue.forEach((item) => {
      const day = new Date(item.createdAt).getDate() - 1;
      dailyData[day].revenue += Number(item._sum.total) || 0;
      dailyData[day].orders += 1;
    });

    return {
      monthly: monthlyData,
      daily: dailyData,
      year: currentYear,
      month: currentMonth + 1,
    };
  }

  async getRecentOrders(limit: number = 10) {
    return this.repository.getRecentOrders(limit);
  }

  async getTopProducts(limit: number = 10) {
    // Get order items with variant information from repository
    const orderItems = await this.repository.getAllOrderItemsWithProducts();

    // Group by product and calculate totals
    const productMap = new Map<
      number,
      {
        product: any;
        totalSold: number;
        orderCount: number;
      }
    >();

    orderItems.forEach((item) => {
      const productId = item.variant.product.id;
      const existing = productMap.get(productId);

      if (existing) {
        existing.totalSold += item.quantity;
        existing.orderCount += 1;
      } else {
        productMap.set(productId, {
          product: item.variant.product,
          totalSold: item.quantity,
          orderCount: 1,
        });
      }
    });

    // Convert to array and sort by total sold
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);

    return topProducts;
  }
}
