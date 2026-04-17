import { useEffect } from "react";
import { Spin } from "antd";
import { useReports } from "../../../hooks/useReports";
import { notify } from "../../../utils/notification";
import dayjs from "dayjs";
import ReportFilters from "../../../components/admin/reports/ReportFilters";
import ReportStats from "../../../components/admin/reports/ReportStats";
import ReportCharts from "../../../components/admin/reports/ReportCharts";
import ReportTable from "../../../components/admin/reports/ReportTable";
import {
  formatRevenueChartData,
  formatOrdersChartData,
  formatTopProductsTableData,
} from "../../../utils/reportHelpers";

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

  useEffect(() => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(30, "day");
    setDateRange({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
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
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
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
      notify.warning("Vui lòng chọn khoảng thời gian");
      return;
    }
    fetchAllReports();
  };

  const handleExport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      notify.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    const exportParams = {};

    if (reportType === "monthly") {
      const year = dayjs(dateRange.startDate).year();
      exportParams.year = year;
    } else if (reportType === "yearly") {
      exportParams.startYear = dayjs(dateRange.startDate).year();
      exportParams.endYear = dayjs(dateRange.endDate).year();
    } else {
      exportParams.startDate = dateRange.startDate;
      exportParams.endDate = dateRange.endDate;
    }

    await exportReport(exportParams);
  };
  const revenueChartData = formatRevenueChartData(revenueData);
  const ordersChartData = formatOrdersChartData(ordersData);
  const productTableData = formatTopProductsTableData(topProductsData);

  const loading =
    summaryLoading || revenueLoading || ordersLoading || customerLoading;

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-[1600px] report-page">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Báo Cáo Thống Kê
          </h1>
          <p className="text-gray-600">
            Theo dõi và phân tích dữ liệu kinh doanh
          </p>
        </div>

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
        <ReportStats summaryData={summaryData} loading={summaryLoading}  />

        <Spin spinning={loading}>
          <ReportCharts
            revenueChartData={revenueChartData}
            ordersChartData={ordersChartData}
          />

          {}
          <ReportTable productTableData={productTableData} />
        </Spin>
      </div>
    </div>
  );
};

export default ReportPage;






