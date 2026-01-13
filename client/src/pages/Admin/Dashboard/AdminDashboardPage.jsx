import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import { Card, Row, Col, Statistic, Badge, Typography, Space, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dashboardService from '../../../services/dashboardService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import TopProducts from '../../../components/admin/Dashboard/TopProducts';
import SalesChart from '../../../components/admin/Dashboard/SalesChart';
import OrderStatusChart from '../../../components/admin/Dashboard/OrderStatusChart';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const { Title, Text } = Typography;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = formatPrice;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, revenueData, ordersData, productsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenue(),
          dashboardService.getRecentOrders(),
          dashboardService.getTopProducts(),
        ]);

        if (isMounted) {
          setStats(statsData);
          setRevenue(revenueData);
          setRecentOrders(ordersData);
          setTopProducts(productsData);
        }
      } catch (error) {
        if (isMounted) {
          notify.error('Không thể tải dữ liệu dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const revenueData = {
    year: revenue?.year,
    chartData: revenue?.monthly?.map(item => ({
      month: `T${item.month}`,
      revenue: item.revenue,
      orders: item.orders || 0
    })) || []
  };

  const orderStatusData = stats?.orders ? [
    { name: 'Chờ xử lý', value: stats.orders.pending || 0, color: '#f59e0b' },
    { name: 'Đang xử lý', value: stats.orders.processing || 0, color: '#3b82f6' },
    { name: 'Đang giao', value: stats.orders.shipped || 0, color: '#8b5cf6' },
    { name: 'Đã giao', value: stats.orders.delivered || 0, color: '#10b981' },
    { name: 'Đã hủy', value: stats.orders.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0) : [];

  const topProductsChartData = topProducts.slice(0, 6).map(item => ({
    name: item.product.name.length > 20 ? item.product.name.substring(0, 20) + '...' : item.product.name,
    sold: item.totalSold,
    revenue: item.totalRevenue || 0
  }));

  if (loading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." variant="admin" />;
  }

  return (
    <div className="p-6">
        <Space direction="vertical" size="small" style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
          <Text type="secondary">Tổng quan hệ thống</Text>
        </Space>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    background: '#f6ffed', 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <DollarSign size={24} style={{ color: '#52c41a' }} />
                  </div>
                  <Badge count={<ArrowUpOutlined style={{ color: '#52c41a' }} />} />
                </Space>
                <Statistic 
                  title="Tổng doanh thu"
                  value={stats?.revenue?.total || 0}
                  suffix="₫"
                  valueStyle={{ color: '#000', fontSize: 24, fontWeight: 600 }}
                  formatter={(value) => formatCurrency(value).replace('₫', '')}
                />
                <Text type="success" style={{ fontSize: 12 }}>+12.5% so với tháng trước</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    background: '#fafafa', 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Package size={24} style={{ color: '#000' }} />
                  </div>
                  {stats?.orders?.pending > 0 && (
                    <Badge count={stats.orders.pending} style={{ backgroundColor: '#faad14' }} />
                  )}
                </Space>
                <Statistic 
                  title="Tổng đơn hàng"
                  value={stats?.orders?.total || 0}
                  valueStyle={{ color: '#000', fontSize: 24, fontWeight: 600 }}
                />
                {stats?.orders?.pending > 0 && (
                  <Text type="warning" style={{ fontSize: 12 }}>{stats.orders.pending} đơn chờ xử lý</Text>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    background: '#fafafa', 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Users size={24} style={{ color: '#595959' }} />
                  </div>
                  {stats?.users?.new > 0 && (
                    <Badge count={`+${stats.users.new}`} style={{ backgroundColor: '#1890ff' }} />
                  )}
                </Space>
                <Statistic 
                  title="Người dùng"
                  value={stats?.users?.total || 0}
                  valueStyle={{ color: '#000', fontSize: 24, fontWeight: 600 }}
                />
                {stats?.users?.new > 0 && (
                  <Text type="secondary" style={{ fontSize: 12 }}>{stats.users.new} người dùng mới</Text>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    background: '#fffbe6', 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <ShoppingBag size={24} style={{ color: '#faad14' }} />
                  </div>
                  {stats?.products?.lowStock > 0 && (
                    <Badge count={stats.products.lowStock} style={{ backgroundColor: '#ff4d4f' }} />
                  )}
                </Space>
                <Statistic 
                  title="Sản phẩm"
                  value={stats?.products?.total || 0}
                  valueStyle={{ color: '#000', fontSize: 24, fontWeight: 600 }}
                />
                {stats?.products?.lowStock > 0 && (
                  <Text type="danger" style={{ fontSize: 12 }}>{stats.products.lowStock} sản phẩm sắp hết</Text>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <SalesChart revenueData={revenueData} topProductsData={topProductsChartData} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <OrderStatusChart orderStatusData={orderStatusData} />
          </Col>
          <Col xs={24} lg={16}>
            <RecentOrders orders={recentOrders} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <TopProducts products={topProducts} />
          </Col>
        </Row>
      </div>
  );
};

export default AdminDashboardPage;
