import { Card, DatePicker, Button, Row, Col, Select } from 'antd';
import { DownloadOutlined, LineChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportFilters = ({
  dateRange,
  reportType,
  loading,
  exportLoading,
  onDateChange,
  onReportTypeChange,
  onFetchReports,
  onExport,
}) => {
  return (
    <Card className="mb-6">
      <Row gutter={16} align="middle">
        <Col xs={24} md={12} lg={8}>
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng thời gian
            </label>
            <RangePicker
              value={dateRange.startDate && dateRange.endDate ? [
                dayjs(dateRange.startDate),
                dayjs(dateRange.endDate)
              ] : null}
              onChange={onDateChange}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              className="w-full"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </div>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo
            </label>
            <Select
              value={reportType}
              onChange={onReportTypeChange}
              className="w-full"
            >
              <Option value="daily">📅 Theo ngày (Chi tiết từng ngày)</Option>
              <Option value="monthly"> Theo tháng (Tổng hợp theo tháng)</Option>
              <Option value="yearly"> Theo năm (Tổng hợp theo năm)</Option>
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              {reportType === 'daily' && 'Hiển thị dữ liệu chi tiết theo từng ngày'}
              {reportType === 'monthly' && 'Tổng hợp dữ liệu theo từng tháng trong năm'}
              {reportType === 'yearly' && 'So sánh dữ liệu giữa các năm'}
            </div>
          </div>
        </Col>
        <Col xs={24} md={24} lg={8}>
          <div className="flex gap-2 mt-6 lg:mt-0">
            <Button
              type="primary"
              icon={<LineChartOutlined />}
              onClick={onFetchReports}
              loading={loading}
              disabled={!dateRange.startDate || !dateRange.endDate}
              className="flex-1"
            >
              Xem báo cáo
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={onExport}
              loading={exportLoading}
              disabled={!dateRange.startDate || !dateRange.endDate}
              className="flex-1"
            >
              Xuất Excel
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ReportFilters;






