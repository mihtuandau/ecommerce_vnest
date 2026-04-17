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
        const year = new Date(dateRange.startDate).getFullYear();
        params.year = year;
      } else if (reportType === 'yearly') {
        params.startYear = new Date(dateRange.startDate).getFullYear();
        params.endYear = new Date(dateRange.endDate).getFullYear();
      } else {
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;
      }

      return reportService.getRevenueReport(params);
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      notify.error('Không thể tải báo cáo doanh thu');
    },
  });

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
    } finally {
      setExportLoading(false);
    }
  };

  const fetchAllReports = async () => {
    try {
      await Promise.all([
        refetchRevenue(),
        refetchOrders(),
        refetchTopProducts(),
        refetchTopCategories(),
        refetchCustomer(),
        refetchSummary(),
      ]);
    } catch (error) {
      notify.error('Có lỗi khi tải báo cáo');
    }
  };

  return {
    dateRange,
    setDateRange,
    reportType,
    setReportType,
    revenueData,
    revenueLoading,
    refetchRevenue,
    ordersData,
    ordersLoading,
    refetchOrders,
    topProductsData,
    topProductsLoading,
    refetchTopProducts,
    topCategoriesData,
    topCategoriesLoading,
    refetchTopCategories,
    customerData,
    customerLoading,
    refetchCustomer,
    summaryData,
    summaryLoading,
    refetchSummary,
    exportReport,
    exportLoading,
    fetchAllReports,
  };
};






