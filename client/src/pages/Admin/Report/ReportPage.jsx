import { useEffect } from 'react';
import { Spin } from 'antd';
import { useReports } from '../../../hooks/useReports';
import { notify } from '../../../utils/notification';
import dayjs from 'dayjs';
import ReportFilters from '../../../components/admin/reports/ReportFilters';
import ReportStats from '../../../components/admin/reports/ReportStats';
import ReportCharts from '../../../components/admin/reports/ReportCharts';
import ReportTable from '../../../components/admin/reports/ReportTable';
import {
  formatRevenueChartData,
  formatOrdersChartData,
  formatTopProductsTableData,
} from '../../../utils/reportHelpers';

const ReportPage = () => {
  const {
    dateRange,
    setDateRange,
    reportType,
    setReportType,
    summaryData,
    summaryLoading,
    revenueData,
    revenueLoading,
    topProductsData,
    topProductsLoading,
    ordersData,
    ordersLoading,
    customerData,
    customerLoading,
    exportReport,
    exportLoading,
    fetchAllReports,
  } = useReports();

  // Set default date range (last 30 days)
  useEffect(() => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(30, 'day');
    setDateRange({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    });
  }, []);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchAllReports();
    }
  }, [dateRange.startDate, dateRange.endDate, reportType]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange({
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setDateRange({ startDate: null, endDate: null });
    }
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleFetchReports = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      notify.warning('Vui lòng chọn khoảng thời gian');
      return;
    }
    fetchAllReports();
  };

  const handleExport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      notify.warning('Vui lòng chọn khoảng thời gian');
      return;
    }
    
    // Build export params based on report type
    const exportParams = {};
    
    if (reportType === 'monthly') {
      // For monthly report, send year parameter
      const year = dayjs(dateRange.startDate).year();
      exportParams.year = year;
    } else if (reportType === 'yearly') {
      // For yearly report, send start and end year
      exportParams.startYear = dayjs(dateRange.startDate).year();
      exportParams.endYear = dayjs(dateRange.endDate).year();
    } else {
      // For daily report, send date range
      exportParams.startDate = dateRange.startDate;
      exportParams.endDate = dateRange.endDate;
    }
    
    await exportReport(exportParams);
  };

  // Memoized formatted data
  const revenueChartData = formatRevenueChartData(revenueData);
  const ordersChartData = formatOrdersChartData(ordersData);
  const productTableData = formatTopProductsTableData(topProductsData);

  const loading = summaryLoading || revenueLoading || ordersLoading || customerLoading;

  return (
    <div className="report-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Báo Cáo Thống Kê</h1>
        <p className="text-gray-600">Theo dõi và phân tích dữ liệu kinh doanh</p>
      </div>

      {/* Filters */}
      <ReportFilters
        dateRange={dateRange}
        reportType={reportType}
        loading={loading}
        exportLoading={exportLoading}
        onDateChange={handleDateChange}
        onReportTypeChange={handleReportTypeChange}
        onFetchReports={handleFetchReports}
        onExport={handleExport}
      />

      <Spin spinning={loading}>
        {/* Statistics Cards */}
        <ReportStats summaryData={summaryData} customerData={customerData} />

        {/* Charts */}
        <ReportCharts
          revenueChartData={revenueChartData}
          ordersChartData={ordersChartData}
        />

        {/* Top Products Table */}
        <ReportTable productTableData={productTableData} />
      </Spin>
    </div>
  );
};

export default ReportPage;
