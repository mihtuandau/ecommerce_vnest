import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons';

const ReportStats = ({ summaryData, customerData }) => {
  const totalRevenue = summaryData?.revenue?.current || 0;
  const revenueChange = summaryData?.revenue?.change || 0;
  const totalOrders = summaryData?.orders?.reduce((sum, item) => sum + (item._count?.id || 0), 0) || 0;
  const totalCustomers = (customerData?.newCustomers || 0) + (customerData?.returningCustomers || 0);

  return (
    <Row gutter={[16, 16]} className="mb-6 mt-6">
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Tổng doanh thu"
            value={totalRevenue}
            precision={0}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#3f8600' }}
            formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Tổng đơn hàng"
            value={totalOrders}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Khách hàng mới"
            value={customerData?.newCustomers || 0}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Tổng khách hàng"
            value={totalCustomers}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ReportStats;
