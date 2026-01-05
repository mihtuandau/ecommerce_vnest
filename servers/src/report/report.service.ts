import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { ReportQueryDto } from './dto/report-query.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(private repository: ReportRepository) {}

  private getDateRange(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async getRevenueByPeriod(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    if (query.year) {
      // Monthly report for a specific year
      const monthlyData = await this.repository.getRevenueByMonth(query.year);
      return {
        type: 'monthly',
        year: query.year,
        data: monthlyData,
      };
    }

    if (query.startYear && query.endYear) {
      // Yearly report
      const yearlyData = await this.repository.getRevenueByYear(
        query.startYear,
        query.endYear,
      );
      return {
        type: 'yearly',
        data: yearlyData,
      };
    }

    // Daily/date range report
    const dailyData = await this.repository.getRevenueByDate(start, end);
    return {
      type: 'daily',
      startDate: start,
      endDate: end,
      data: dailyData,
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

    const [
      revenueData,
      ordersByStatus,
      topProducts,
      topCategories,
      customerStats,
    ] = await Promise.all([
      query.year
        ? this.repository.getRevenueByMonth(query.year)
        : this.repository.getRevenueByDate(start, end),
      this.repository.getOrdersByStatus(start, end),
      this.repository.getTopProducts(start, end, 10),
      this.repository.getTopCategories(start, end, 10),
      this.repository.getCustomerStats(start, end),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce System';
    workbook.created = new Date();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Tổng Quan');
    summarySheet.columns = [
      { header: 'Chỉ Số', key: 'metric', width: 30 },
      { header: 'Giá Trị', key: 'value', width: 20 },
    ];

    summarySheet.addRows([
      { metric: 'Thời Gian Báo Cáo', value: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}` },
      { metric: '', value: '' },
      { metric: 'Khách Hàng Mới', value: customerStats.newCustomers },
      { metric: 'Khách Hàng Quay Lại', value: customerStats.returningCustomers },
      { metric: 'Tổng Đơn Hàng', value: customerStats.totalOrders },
    ]);

    // Revenue Sheet
    const revenueSheet = workbook.addWorksheet('Doanh Thu');
    if (query.year) {
      revenueSheet.columns = [
        { header: 'Tháng', key: 'month', width: 15 },
        { header: 'Doanh Thu', key: 'revenue', width: 20 },
        { header: 'Số Đơn', key: 'orders', width: 15 },
      ];
      revenueSheet.addRows(revenueData);
    } else {
      revenueSheet.columns = [
        { header: 'Ngày', key: 'date', width: 20 },
        { header: 'Doanh Thu', key: 'revenue', width: 20 },
      ];
      revenueSheet.addRows(
        revenueData.map((item: any) => ({
          date: new Date(item.createdAt).toLocaleDateString(),
          revenue: item._sum?.total || 0,
        })),
      );
    }

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
      { header: 'Sản Phẩm', key: 'productName', width: 30 },
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

    // Top Categories Sheet
    const categoriesSheet = workbook.addWorksheet('Danh Mục Bán Chạy');
    categoriesSheet.columns = [
      { header: 'Danh Mục', key: 'categoryName', width: 30 },
      { header: 'Số Đơn Hàng', key: 'orders', width: 15 },
      { header: 'Doanh Thu', key: 'revenue', width: 20 },
    ];
    categoriesSheet.addRows(
      topCategories.map((item) => ({
        categoryName: item.categoryName,
        orders: item.totalOrders,
        revenue: item.totalRevenue,
      })),
    );

    // Style headers
    [summarySheet, revenueSheet, ordersSheet, productsSheet, categoriesSheet].forEach(
      (sheet) => {
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
      },
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
