import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { ReportQueryDto } from '../report/dto/report-query.dto';

@Injectable()
export class DashboardService {
  constructor(private repository: DashboardRepository) {}

  async getStats() {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalRevenue,
      todayRevenue,
      yesterdayRevenue,
      todayNewUsers,
      yesterdayNewUsers,
      todayOrders,
      yesterdayOrders,
      lowStockCount,
    ] = await Promise.all([
      this.repository.getTotalUsers(),
      this.repository.getTotalProducts(),
      this.repository.getTotalCategories(),
      this.repository.getTotalOrders(),
      this.repository.getOrderCountByStatus('PENDING'),
      this.repository.getOrderCountByStatus('PROCESSING'),
      this.repository.getOrderCountByStatus('SHIPPED'),
      this.repository.getOrderCountByStatus('DELIVERED'),
      this.repository.getOrderCountByStatus('CANCELLED'),
      this.repository.getTotalCustomers(),
      this.repository.getTotalRevenue(),
      this.repository.getRevenueByDate(new Date()), // Today
      this.repository.getRevenueByDate(new Date(Date.now() - 86400000)), // Yesterday
      this.repository.getNewUsersCount(new Date()), // Today
      this.repository.getNewUsersCount(new Date(Date.now() - 86400000)), // Yesterday
      this.repository.getOrderCountByDate(new Date()), // Today
      this.repository.getOrderCountByDate(new Date(Date.now() - 86400000)), // Yesterday
      this.repository.getLowStockCount(10),
    ]);

    // Helper function to calculate percentage change
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return parseFloat((((current - previous) / previous) * 100).toFixed(1));
    };

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
        admins: totalUsers - totalCustomers,
        new: todayNewUsers,
        change: calculateChange(todayNewUsers, yesterdayNewUsers),
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
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        today: todayOrders,
        change: calculateChange(todayOrders, yesterdayOrders),
      },
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        change: calculateChange(todayRevenue, yesterdayRevenue),
        currency: 'VND',
      },
    };
  }

  async getRevenueAnalytics(query: ReportQueryDto) {
    const now = new Date();
    const year = query.year || now.getFullYear();

    // Nếu chọn xem Theo Năm (Monthly)
    if (query.year || (!query.startDate && !query.endDate)) {
      const orders = await this.repository.getMonthlyRevenue(year);
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        label: `T${i + 1}`,
        revenue: 0,
        orders: 0,
      }));

      orders.forEach((item: any) => {
        const date = new Date(item.createdAt);
        const vnTime = new Date(
          date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
        );
        const month = vnTime.getMonth();
        monthlyData[month].revenue += Number(item.subtotal) || 0;
        monthlyData[month].orders += 1;
      });

      // Nếu không có query ngày tháng, bổ sung thêm dữ liệu ngày của tháng hiện tại
      if (!query.startDate && !query.endDate) {
        const dailyData = await this.getDailyData(
          now.getFullYear(),
          now.getMonth(),
        );
        return {
          type: 'summary',
          monthly: monthlyData,
          daily: dailyData,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        };
      }

      return { type: 'monthly', data: monthlyData, year };
    }

    // Nếu chọn xem Theo Khoảng Ngày (Daily)
    const startDateStr = query.startDate as string;
    const endDateStr = query.endDate as string;

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);

    // Logic: Nếu khoảng cách > 62 ngày (approx 2 months), gộp theo THÁNG
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    const orders = await this.repository.getRevenueByDateRange(start, end);

    if (diffDays > 62) {
      const dataMap = new Map();

      const current = new Date(start);
      while (current <= end) {
        const key = `T${current.getMonth() + 1}/${current.getFullYear()}`;
        if (!dataMap.has(key)) {
          dataMap.set(key, { label: key, revenue: 0, orders: 0 });
        }
        current.setMonth(current.getMonth() + 1);
      }

      orders.forEach((item: any) => {
        const date = new Date(item.createdAt);
        const vnTime = new Date(
          date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
        );
        const key = `T${vnTime.getMonth() + 1}/${vnTime.getFullYear()}`;
        if (dataMap.has(key)) {
          const entry = dataMap.get(key);
          entry.revenue += Number(item.subtotal) || 0;
          entry.orders += 1;
        }
      });

      return {
        type: 'monthly',
        data: Array.from(dataMap.values()),
        startDate: query.startDate,
        endDate: query.endDate,
      };
    }

    // Sử dụng Map để gộp dữ liệu theo ngày thực tế đặt đơn
    const dataMap = new Map();

    orders.forEach((item: any) => {
      // 🌏 Chuyển đổi chính xác sang múi giờ VN
      const date = new Date(item.createdAt);
      const vnTime = new Date(
        date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      );

      const label = `${vnTime.getDate()}/${vnTime.getMonth() + 1}`;

      if (!dataMap.has(label)) {
        // Tạo khóa tạm để sắp xếp (vẫn dùng VN Time cho chuẩn)
        const sortKey = new Date(vnTime).setHours(0, 0, 0, 0);
        dataMap.set(label, { label, revenue: 0, orders: 0, sortKey });
      }

      const entry = dataMap.get(label);
      entry.revenue += Number(item.subtotal) || 0;
      entry.orders += 1;
    });

    const data = Array.from(dataMap.values()).sort(
      (a, b) => a.sortKey - b.sortKey,
    );
    return {
      type: 'daily',
      data,
      startDate: query.startDate,
      endDate: query.endDate,
    };
  }

  private async getDailyData(year: number, month: number) {
    const orders = await this.repository.getDailyRevenue(year, month);
    const dataMap = new Map();

    orders.forEach((item: any) => {
      const date = new Date(item.createdAt);
      const vnTime = new Date(
        date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      );

      const label = `${vnTime.getDate()}/${vnTime.getMonth() + 1}`;

      if (!dataMap.has(label)) {
        dataMap.set(label, {
          label,
          revenue: 0,
          orders: 0,
          day: vnTime.getDate(),
        });
      }

      const entry = dataMap.get(label);
      entry.revenue += Number(item.subtotal) || 0;
      entry.orders += 1;
    });

    return Array.from(dataMap.values()).sort((a, b) => a.day - b.day);
  }

  async getRecentOrders(limit: number = 10) {
    return this.repository.getRecentOrders(limit);
  }

  async getTopProducts(limit: number = 10) {
    const orderItems = await this.repository.getAllOrderItemsWithProducts();

    const productMap = new Map<
      number,
      {
        product: any;
        totalSold: number;
        totalRevenue: number;
        orderCount: number;
      }
    >();

    orderItems.forEach((item) => {
      const product = item.variant.product;
      const order = (item as any).order;
      const productId = product.id;
      
      const itemRevenue = Number(item.price) * item.quantity;

      const existing = productMap.get(productId);

      if (existing) {
        existing.totalSold += item.quantity;
        existing.totalRevenue += itemRevenue;
        existing.orderCount += 1;
      } else {
        // Tìm ảnh đại diện
        const thumbnail =
          (product as any).images?.find((img: any) => img.isThumbnail)?.url ||
          (product as any).images?.[0]?.url;

        productMap.set(productId, {
          product: {
            id: product.id,
            name: product.name,
            thumbnail: thumbnail,
            price: item.price,
          },
          totalSold: item.quantity,
          totalRevenue: itemRevenue,
          orderCount: 1,
        });
      }
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);

    return topProducts;
  }
}
