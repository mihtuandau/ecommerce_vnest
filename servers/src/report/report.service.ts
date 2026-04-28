import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { ReportQueryDto } from './dto/report-query.dto';
import * as ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class ReportService {
  constructor(private repository: ReportRepository) {}

  private getDateRange(startDate?: string, endDate?: string) {
    const vnNow = dayjs().tz('Asia/Ho_Chi_Minh');
    
    const start = startDate 
      ? dayjs(startDate).tz('Asia/Ho_Chi_Minh').startOf('day') 
      : vnNow.subtract(30, 'day').startOf('day');
      
    const end = endDate 
      ? dayjs(endDate).tz('Asia/Ho_Chi_Minh').endOf('day') 
      : vnNow.endOf('day');

    return { 
      start: start.toDate(), 
      end: end.toDate() 
    };
  }

  async getRevenueByPeriod(query: ReportQueryDto) {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    const rawOrders = await this.repository.getRawOrdersForRevenue(start, end);

    const dataMap = new Map<string, { label: string; revenue: number; total: number; orders: number; sortKey: number }>();

    // Initialize the map with all dates in the range
    let current = dayjs(start).tz('Asia/Ho_Chi_Minh');
    const endDay = dayjs(end).tz('Asia/Ho_Chi_Minh');
    
    while (current.isBefore(endDay) || current.isSame(endDay, 'day')) {
      const label = current.format('DD/MM');
      const sortKey = current.valueOf();

      dataMap.set(label, {
        label,
        revenue: 0,
        total: 0,
        orders: 0,
        sortKey
      });

      current = current.add(1, 'day');
    }

    rawOrders.forEach((order) => {
      const vnTime = dayjs(order.createdAt).tz('Asia/Ho_Chi_Minh');
      const label = vnTime.format('DD/MM');

      const existing = dataMap.get(label);
      const revenue = (Number(order.subtotal) || 0) - (Number(order.discountAmount) || 0);

      if (existing) {
        existing.revenue += revenue;
        existing.total += revenue;
        existing.orders += 1;
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
      revenueReport,
      revenueComparison,
      ordersComparison,
      ordersByStatus,
      products,
      customers,
      topProducts,
      todayOrders,
    ] = await Promise.all([
      this.getRevenueByPeriod(query),
      this.repository.getRevenueComparison(start, end),
      this.repository.getOrdersComparison(start, end),
      this.repository.getOrdersByStatus(start, end),
      this.repository.getProductStats(),
      this.repository.getCustomerGrowth(start, end),
      this.repository.getTopProducts(start, end, 5),
      this.repository.getTodayOrders(),
    ]);

    // Đảm bảo tổng trong kỳ khớp 100% với biểu đồ
    const periodRevenue = revenueReport.data.reduce((sum: number, item: any) => sum + item.revenue, 0);
    const periodOrders = revenueReport.data.reduce((sum: number, item: any) => sum + item.orders, 0);

    return {
      period: {
        startDate: start,
        endDate: end,
      },
      revenue: {
        total: periodRevenue,
        absoluteTotal: revenueComparison.absoluteTotal,
        growth: revenueComparison.growth,
      },
      orders: {
        periodTotal: periodOrders, // Dùng tổng từ biểu đồ
        total: ordersComparison.total,
        growth: ordersComparison.growth,
        today: todayOrders.today,
        change: todayOrders.change,
      },
      ordersByStatus,
      products,
      users: customers,
      topProducts,
    };
  }

  async exportToExcel(query: ReportQueryDto): Promise<Buffer> {
    const { start, end } = this.getDateRange(query.startDate, query.endDate);

    const [
      revenueReport,
      ordersByStatus,
      topProducts,
      topCategories,
      customerStats,
      detailedOrders,
    ] = await Promise.all([
      this.getRevenueByPeriod(query),
      this.repository.getOrdersByStatus(start, end),
      this.repository.getTopProducts(start, end, 20),
      this.repository.getTopCategories(start, end, 10),
      this.repository.getCustomerStats(start, end),
      this.repository.getDetailedOrders(start, end),
    ]) as any[];

    const revenueData = revenueReport.data;
    const totalNetSales = detailedOrders.reduce((acc: number, curr: any) => acc + (Number(curr.subtotal || 0) - Number(curr.discountAmount || 0)), 0);
    const totalDiscount = detailedOrders.reduce((acc: number, curr: any) => acc + Number(curr.discountAmount || 0), 0);
    const totalRefund = detailedOrders.reduce((acc: number, curr: any) => acc + Number(curr.payment?.refundAmount || 0), 0);
    const totalNetRevenue = totalNetSales;
    const totalOrders = detailedOrders.length;
    const aov = totalOrders > 0 ? totalNetRevenue / totalOrders : 0;
    const totalItemsSold = topProducts.reduce((acc: number, curr: any) => acc + curr.totalQuantity, 0);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Vnest E-Commerce';
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Tổng Quan');
    summarySheet.columns = [
      { header: 'Chỉ Số Hệ Thống', key: 'metric', width: 40 },
      { header: 'Giá Trị Thống Kê', key: 'value', width: 30 },
    ];

    const fmt = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    summarySheet.addRows([
      { metric: 'KHOẢNG THỜI GIAN BÁO CÁO', value: `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}` },
      { metric: '', value: '' },
      { metric: '--- CHỈ SỐ TÀI CHÍNH (Tiền hàng - Giảm giá) ---', value: '' },
      { metric: '1. Doanh thu thuần (Chưa tính ship)', value: fmt(totalNetSales) },
      { metric: '2. Tổng giá trị giảm giá đã áp dụng', value: fmt(totalDiscount) },
      { metric: '3. DOANH THU CUỐI CÙNG', value: fmt(totalNetRevenue) },
      { metric: '5. Giá trị đơn hàng trung bình (AOV)', value: fmt(aov) },
      { metric: '', value: '' },
      { metric: '--- CHỈ SỐ VẬN HÀNH ---', value: '' },
      { metric: '6. Tổng số đơn hàng trong kỳ', value: totalOrders },
      { metric: '7. Tổng số lượng sản phẩm đã bán', value: totalItemsSold },
      { metric: '8. Tổng số khách hàng mới', value: customerStats.newCustomers },
      { metric: '9. Tổng số khách hàng quay lại', value: customerStats.returningCustomers },
    ]);

    // Apply bold to headers and category labels
    [1, 3, 7, 10].forEach(rowNum => {
      summarySheet.getRow(rowNum).font = { bold: true };
    });
    summarySheet.getRow(7).font = { bold: true, color: { argb: 'FF000000' } }; // Net Revenue highlight

    // Detailed Orders Sheet
    const detailSheet = workbook.addWorksheet('Danh Sách Đơn Hàng');
    detailSheet.columns = [
      { header: 'Mã Đơn', key: 'orderCode', width: 15 },
      { header: 'Ngày Tạo', key: 'createdAt', width: 20 },
      { header: 'Khách Hàng', key: 'customer', width: 25 },
      { header: 'Số Điện Thoại', key: 'phone', width: 15 },
      { header: 'Tổng Tiền', key: 'subtotal', width: 15 },
      { header: 'Giảm Giá', key: 'discount', width: 15 },
      { header: 'Hoàn Tiền', key: 'refund', width: 15 },
      { header: 'Doanh Thu Thuần', key: 'net', width: 15 },
      { header: 'Phương Thức', key: 'method', width: 15 },
      { header: 'Trạng Thái', key: 'status', width: 15 },
    ];

    detailedOrders.forEach((order: any) => {
      const netRevenue = Number(order.subtotal) - Number(order.discountAmount) - Number(order.payment?.refundAmount || 0);
      
      // Ưu tiên lấy tên từ Member, nếu không có thì lấy từ ShippingSnapshot (khách vãng lai)
      const customerName = order.user?.name || order.shippingSnapshot?.fullName || order.fullName || 'Khách vãng lai';
      const customerPhone = order.guestPhone || order.phone || order.shippingSnapshot?.phone || 'N/A';

      detailSheet.addRow({
        orderCode: order.orderCode,
        createdAt: new Date(order.createdAt).toLocaleString('vi-VN'),
        customer: customerName,
        phone: customerPhone,
        subtotal: Number(order.subtotal),
        discount: Number(order.discountAmount || 0),
        net: (Number(order.subtotal) || 0) - (Number(order.discountAmount) || 0),
        method: order.payment?.method || 'N/A',
        status: order.status,
      });
    });

    // Formatting currency columns
    ['E', 'F', 'G', 'H'].forEach(col => {
      detailSheet.getColumn(col).numFmt = '#,##0 "₫"';
    });

    // Revenue Sheet
    const revenueSheet = workbook.addWorksheet('Doanh Thu Theo Ngày');
    revenueSheet.columns = [
      { header: 'Ngày', key: 'date', width: 20 },
      { header: 'Doanh Thu', key: 'revenue', width: 20 },
      { header: 'Số Đơn', key: 'orders', width: 15 },
    ];
    revenueSheet.addRows(revenueData);
    revenueSheet.getColumn('B').numFmt = '#,##0 "₫"';

    const ordersSheet = workbook.addWorksheet('Trạng Thái Đơn Hàng');
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

    const productsSheet = workbook.addWorksheet('Sản Phẩm Bán Chạy');
    productsSheet.columns = [
      { header: 'Sản Phẩm', key: 'productName', width: 40 },
      { header: 'Số Lượng Bán', key: 'quantity', width: 15 },
      { header: 'Doanh Thu Thuần', key: 'revenue', width: 20 },
    ];
    productsSheet.addRows(
      topProducts.map((item) => ({
        productName: item.productName,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
      })),
    );
    productsSheet.getColumn('C').numFmt = '#,##0 "₫"';

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}






