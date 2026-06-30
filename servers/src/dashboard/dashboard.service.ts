import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { ReportQueryDto } from '../report/dto/report-query.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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
      returnRequestedOrders,
      returnedOrders,
      pendingReviewsCount,
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
      this.repository.getRevenueByDate(dayjs().tz('Asia/Ho_Chi_Minh').toDate()),
      this.repository.getRevenueByDate(
        dayjs().tz('Asia/Ho_Chi_Minh').subtract(1, 'day').toDate(),
      ),
      this.repository.getNewUsersCount(dayjs().tz('Asia/Ho_Chi_Minh').toDate()),
      this.repository.getNewUsersCount(
        dayjs().tz('Asia/Ho_Chi_Minh').subtract(1, 'day').toDate(),
      ),
      this.repository.getOrderCountByDate(
        dayjs().tz('Asia/Ho_Chi_Minh').toDate(),
      ),
      this.repository.getOrderCountByDate(
        dayjs().tz('Asia/Ho_Chi_Minh').subtract(1, 'day').toDate(),
      ),
      this.repository.getLowStockCount(10),
      this.repository.getOrderCountByStatus('RETURN_REQUESTED'),
      this.repository.getOrderCountByStatus('RETURNED'),
      this.repository.getPendingReviewsCount(),
    ]);

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
        returned: returnedOrders,
        returning: returnRequestedOrders,
        today: todayOrders,
        change: calculateChange(todayOrders, yesterdayOrders),
      },
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        change: calculateChange(todayRevenue, yesterdayRevenue),
        currency: 'VND',
      },
      reviews: {
        pendingCount: pendingReviewsCount,
      },
    };
  }

  async getPendingReviews(limit: number = 5) {
    return this.repository.getPendingReviews(limit);
  }

  async getRevenueAnalytics(query: ReportQueryDto) {
    const now = new Date();
    const year = query.year || now.getFullYear();

    if (query.year || (!query.startDate && !query.endDate)) {
      const orders = await this.repository.getMonthlyRevenue(year);
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        label: `T${i + 1}`,
        revenue: 0,
        orders: 0,
      }));

      orders.forEach((item: any) => {
        const vnTime = dayjs(item.payment?.updatedAt || item.createdAt).tz(
          'Asia/Ho_Chi_Minh',
        );
        const month = vnTime.month();
        const subtotal = Number(item.subtotal) || 0;
        const discount = Number(item.discountAmount) || 0;
        const netRevenue = subtotal - discount;

        monthlyData[month].revenue += netRevenue;
        monthlyData[month].orders += 1;
      });

      if (!query.startDate && !query.endDate) {
        const vnNow = dayjs().tz('Asia/Ho_Chi_Minh');
        const dailyData = await this.getDailyData(vnNow.year(), vnNow.month());
        return {
          type: 'summary',
          monthly: monthlyData,
          daily: dailyData,
          year: vnNow.year(),
          month: vnNow.month() + 1,
        };
      }

      return { type: 'monthly', data: monthlyData, year };
    }

    const startDateStr = query.startDate as string;
    const endDateStr = query.endDate as string;

    const start = dayjs(startDateStr).startOf('day');
    const end = dayjs(endDateStr).endOf('day');

    const diffDays = end.diff(start, 'day');

    const orders = await this.repository.getRevenueByDateRange(
      start.toDate(),
      end.toDate(),
    );

    if (diffDays > 62) {
      const dataMap = new Map();

      orders.forEach((item: any) => {
        const vnTime = dayjs(item.payment?.updatedAt || item.createdAt).tz(
          'Asia/Ho_Chi_Minh',
        );
        const key = `T${vnTime.month() + 1}/${vnTime.year()}`;
        if (!dataMap.has(key)) {
          dataMap.set(key, { label: key, revenue: 0, orders: 0 });
        }
        const entry = dataMap.get(key);
        const total = Number(item.total) || 0;
        const refund = Number(item.payment?.refundAmount) || 0;
        const netRevenue = total - refund;

        entry.revenue += netRevenue;
        entry.orders += 1;
      });

      return {
        type: 'monthly',
        data: Array.from(dataMap.values()),
        startDate: query.startDate,
        endDate: query.endDate,
      };
    }

    const dataMap = new Map();

    orders.forEach((item: any) => {
      const vnTime = dayjs(item.payment?.updatedAt || item.createdAt).tz(
        'Asia/Ho_Chi_Minh',
      );
      const label = vnTime.format('DD/MM');

      if (!dataMap.has(label)) {
        const sortKey = vnTime.startOf('day').valueOf();
        dataMap.set(label, { label, revenue: 0, orders: 0, sortKey });
      }

      const entry = dataMap.get(label);
      const subtotal = Number(item.subtotal) || 0;
      const discount = Number(item.discountAmount) || 0;
      const netRevenue = subtotal - discount;

      entry.revenue += netRevenue;
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
      const vnTime = dayjs(item.payment?.updatedAt || item.createdAt).tz(
        'Asia/Ho_Chi_Minh',
      );
      const label = vnTime.format('DD/MM');

      if (!dataMap.has(label)) {
        dataMap.set(label, {
          label,
          revenue: 0,
          orders: 0,
          day: vnTime.date(),
        });
      }

      const entry = dataMap.get(label);
      const subtotal = Number(item.subtotal) || 0;
      const discount = Number(item.discountAmount) || 0;
      const netRevenue = subtotal - discount;

      entry.revenue += netRevenue;
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
        id: number;
        productName: string;
        image: string;
        totalQuantity: number;
        totalRevenue: number;
        orderCount: number;
      }
    >();

    orderItems.forEach((item) => {
      const variant = item.variant;
      if (!variant) return;

      const product = variant.product;
      if (!product) return;

      const productId = product.id;
      const order = item.order as any;
      if (!order) return;

      const returnedQty = (order.returnRequests || [])
        .filter((r: any) => r.status === 'RECEIVED' || r.status === 'COMPLETED')
        .reduce((sum: number, r: any) => {
          const rItems = r.returnItems || [];
          const rItem = rItems.find((ri: any) => ri.orderItemId === item.id);
          return sum + (rItem?.quantity || 0);
        }, 0);

      const netQuantity = (item.quantity || 0) - returnedQty;
      const price = Number(item.price) || 0;
      const netRevenue = price * netQuantity;

      if (netQuantity <= 0) return;

      const existing = productMap.get(productId);
      if (existing) {
        existing.totalQuantity += netQuantity;
        existing.totalRevenue += netRevenue;
        existing.orderCount += 1;
      } else {
        const images = (product as any).images || [];
        const thumbnail =
          images.find((img: any) => img.isThumbnail)?.url ||
          images[0]?.url ||
          '';

        productMap.set(productId, {
          id: productId,
          productName: product.name || 'N/A',
          image: thumbnail,
          totalQuantity: netQuantity,
          totalRevenue: netRevenue,
          orderCount: 1,
        });
      }
    });

    const topSelling = Array.from(productMap.values())
      .filter((p) => p.totalQuantity > 0)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);

    // Fetch real ratings for top products
    const productIds = topSelling.map((p) => p.id);
    const ratings = await this.repository.getProductRatings(productIds);

    const ratingMap = new Map(
      ratings.map((r: any) => [r.productId, r._avg.rating]),
    );

    return topSelling.map((p) => ({
      ...p,
      rating: parseFloat((Number(ratingMap.get(p.id)) || 0).toFixed(1)),
    }));
  }
}
