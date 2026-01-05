import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportService from '../services/reportService';
import { notify } from '../utils/notification';

export const useReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [reportType, setReportType] = useState('daily');

  // Get revenue report
  const {
    data: revenueData,
    isLoading: revenueLoading,
    refetch: refetchRevenue,
    error: revenueError,
  } = useQuery({
    queryKey: ['revenue-report', dateRange, reportType],
    queryFn: () => {
      const params = {};
      
      if (reportType === 'monthly') {
        // For monthly report, send year parameter
        const year = new Date(dateRange.startDate).getFullYear();
        params.year = year;
      } else if (reportType === 'yearly') {
        // For yearly report, send start and end year
        params.startYear = new Date(dateRange.startDate).getFullYear();
        params.endYear = new Date(dateRange.endDate).getFullYear();
      } else {
        // For daily report, send date range
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;
      }
      
      console.log('Fetching revenue report with params:', params);
      return reportService.getRevenueReport(params);
    },
    enabled: false, // Manual trigger
    retry: 1,
    onError: (error) => {
      console.error('Revenue report error:', error);
      notify.error('Không thể tải báo cáo doanh thu');
    },
  });

  // Get orders report
  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['orders-report', dateRange],
    queryFn: () => {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      return reportService.getOrdersReport(params);
    },
    enabled: false,
  });

  // Get top products
  const {
    data: topProductsData,
    isLoading: topProductsLoading,
    refetch: refetchTopProducts,
  } = useQuery({
    queryKey: ['top-products-report', dateRange],
    queryFn: () => {
      const params = { limit: 10 };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      return reportService.getTopProducts(params);
    },
    enabled: false,
  });

  // Get top categories
  const {
    data: topCategoriesData,
    isLoading: topCategoriesLoading,
    refetch: refetchTopCategories,
  } = useQuery({
    queryKey: ['top-categories-report', dateRange],
    queryFn: () => {
      const params = { limit: 10 };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      return reportService.getTopCategories(params);
    },
    enabled: false,
  });

  // Get customer report
  const {
    data: customerData,
    isLoading: customerLoading,
    refetch: refetchCustomer,
  } = useQuery({
    queryKey: ['customer-report', dateRange],
    queryFn: () => {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      return reportService.getCustomerReport(params);
    },
    enabled: false,
  });

  // Get summary report
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['summary-report', dateRange],
    queryFn: () => {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      return reportService.getSummaryReport(params);
    },
    enabled: false,
  });

  // Export to Excel
  const [exportLoading, setExportLoading] = useState(false);
  const exportReport = async (customParams = {}) => {
    try {
      setExportLoading(true);
      const params = { ...customParams };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      await reportService.exportToExcel(params);
      notify.success('Xuất báo cáo Excel thành công!');
    } catch (error) {
      notify.error('Không thể xuất báo cáo');
      console.error('Export error:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // Fetch all reports
  const fetchAllReports = async () => {
    console.log('Fetching all reports with dateRange:', dateRange);
    try {
      await Promise.all([
        refetchRevenue(),
        refetchOrders(),
        refetchTopProducts(),
        refetchTopCategories(),
        refetchCustomer(),
        refetchSummary(),
      ]);
      console.log('All reports fetched successfully');
    } catch (error) {
      console.error('Error fetching reports:', error);
      notify.error('Có lỗi khi tải báo cáo');
    }
  };

  return {
    // Date range & report type
    dateRange,
    setDateRange,
    reportType,
    setReportType,

    // Revenue
    revenueData,
    revenueLoading,
    refetchRevenue,

    // Orders
    ordersData,
    ordersLoading,
    refetchOrders,

    // Top products
    topProductsData,
    topProductsLoading,
    refetchTopProducts,

    // Top categories
    topCategoriesData,
    topCategoriesLoading,
    refetchTopCategories,

    // Customer stats
    customerData,
    customerLoading,
    refetchCustomer,

    // Summary
    summaryData,
    summaryLoading,
    refetchSummary,

    // Export
    exportReport,
    exportLoading,

    // Fetch all
    fetchAllReports,
  };
};
