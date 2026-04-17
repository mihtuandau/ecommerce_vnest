import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { ReportQueryDto } from './dto/report-query.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(private repository: ReportRepository) {}

  private getDateRange(startDate?: string, endDate?: string) {
    let start: Date;
    let end: Date;

    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
    } else {
      start = new Date();
      start.setDate(start.getDate() - 7); // Mặc định 7 ngày
      start.setHours(0, 0, 0, 0);
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }

  async getRevenueByPeriod(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    const rawOrders = await this.repository.getRawOrdersForRevenue(start, end);

    // Gộp nhóm bằng Javascript để đảm bảo múi giờ VN tuyệt đối
    const dataMap = new Map<string, { label: string; revenue: number; total: number; orders: number; sortKey: number }>();

    rawOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      // Chuyển sang chuỗi ngày VN: "DD/MM"
      const label = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
      });

      const sortKey = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })).setHours(0,0,0,0);

      const existing = dataMap.get(label);
      const revenue = Number(order.subtotal) || 0;

      if (existing) {
        existing.revenue += revenue;
        existing.total += revenue;
        existing.orders += 1;
      } else {
        dataMap.set(label, {
          label,
          revenue,
          total: revenue,
          orders: 1,
          sortKey
        });
      }
    });

    const data = Array.from(dataMap.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(item => ({
        date: item.label,
        revenue: item.revenue,
        total: item.total,
        orders: item.orders
      }));

    return {
      type: 'daily',
      startDate: start,
      endDate: end,
      data,
    };
  }

  async getOrdersReport(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);
    const ordersByStatus = await this.repository.getOrdersByStatus(start, end);

    return {
      startDate: start,
      endDate: end,
      data: ordersByStatus,
    };
  }

  async getTopProductsReport(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);
    const limit = query.limit || 10;
    const topProducts = await this.repository.getTopProducts(start, end, limit);

    return {
      startDate: start,
      endDate: end,
      data: topProducts,
    };
  }

  async getTopCategoriesReport(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);
    const limit = query.limit || 10;
    const topCategories = await this.repository.getTopCategories(start, end, limit);

    return {
      startDate: start,
      endDate: end,
      data: topCategories,
    };
  }

  async getCustomerReport(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);
    const customerStats = await this.repository.getCustomerStats(start, end);

    return {
      startDate: start,
      endDate: end,
      ...customerStats,
    };
  }

  async getSummaryReport(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    const [
      revenueComparison,
      ordersByStatus,
      topProducts,
      topCategories,
      customerStats,
    ] = await Promise.all([
      this.repository.getRevenueComparison(start, end),
      this.repository.getOrdersByStatus(start, end),
      this.repository.getTopProducts(start, end, 5),
      this.repository.getTopCategories(start, end, 5),
      this.repository.getCustomerStats(start, end),
    ]);

    return {
      period: {
        startDate: start,
        endDate: end,
      },
      revenue: revenueComparison,
      orders: ordersByStatus,
      topProducts,
      topCategories,
      customers: customerStats,
    };
  }

  async exportToExcel(query: ReportQueryDto): Promise<Buffer> {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    // Sử dụng chung logic gộp nhóm của web để xuất Excel
    const revenueReport = await this.getRevenueByPeriod(query);
    const revenueData = revenueReport.data;

    const [
      ordersByStatus,
      topProducts,
      topCategories,
      customerStats,
    ] = await Promise.all([
      this.repository.getOrdersByStatus(start, end),
      this.repository.getTopProducts(start, end, 10),
      this.repository.getTopCategories(start, end, 10),
      this.repository.getCustomerStats(start, end),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce System';
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Tổng Quan');
    summarySheet.columns = [
      { header: 'Chỉ Số', key: 'metric', width: 30 },
      { header: 'Giá Trị', key: 'value', width: 20 },
    ];

    summarySheet.addRows([
      { metric: 'Thời Gian Báo Cáo', value: `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}` },
      { metric: '', value: '' },
      { metric: 'Khách Hàng Mới', value: customerStats.newCustomers },
      { metric: 'Khách Hàng Quay Lại', value: customerStats.returningCustomers },
      { metric: 'Tổng Đơn Hàng', value: customerStats.totalOrders },
    ]);

    // Revenue Sheet
    const revenueSheet = workbook.addWorksheet('Doanh Thu');
    revenueSheet.columns = [
      { header: 'Ngày', key: 'date', width: 20 },
      { header: 'Doanh Thu', key: 'revenue', width: 20 },
      { header: 'Số Đơn', key: 'orders', width: 15 },
    ];
    revenueSheet.addRows(revenueData);

    // Orders by Status Sheet
    const ordersSheet = workbook.addWorksheet('Đơn Hàng Theo Trạng Thái');
    ordersSheet.columns = [
      { header: 'Trạng Thái', key: 'status', width: 20 },
      { header: 'Số Lượng', key: 'count', width: 15 },
    ];
    ordersSheet.addRows(
      ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
    );

    // Top Products Sheet
    const productsSheet = workbook.addWorksheet('Sản Phẩm Bán Chạy');
    productsSheet.columns = [
      { header: 'Sản Phẩm', key: 'productName', width: 35 },
      { header: 'Số Lượng Bán', key: 'quantity', width: 15 },
      { header: 'Doanh Thu', key: 'revenue', width: 20 },
    ];
    productsSheet.addRows(
      topProducts.map((item) => ({
        productName: item.productName,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
      })),
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
