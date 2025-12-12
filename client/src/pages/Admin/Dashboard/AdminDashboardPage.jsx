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
import dashboardService from '../../../services/dashboardService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import TopProducts from '../../../components/admin/Dashboard/TopProducts';
import SalesChart from '../../../components/admin/Dashboard/SalesChart';
import OrderStatusChart from '../../../components/admin/Dashboard/OrderStatusChart';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format helpers
  const formatCurrency = formatPrice;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, revenueData, ordersData, productsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenue(),
        dashboardService.getRecentOrders(),
        dashboardService.getTopProducts(),
      ]);

      setStats(statsData);
      setRevenue(revenueData);
      setRecentOrders(ordersData);
      setTopProducts(productsData);
    } catch (error) {
      notify.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
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
    return <Loading fullScreen text="Đang tải dữ liệu..." />;
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
          </div>
        </div>

      {/* Stats Cards - Clean & Professional */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              +12.5%
            </span>
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.revenue?.total ? formatCurrency(stats.revenue.total) : '0 ₫'}
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-900" />
            </div>
            {stats?.orders?.pending > 0 && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {stats.orders.pending} chờ
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.orders?.total || 0}</p>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            {stats?.users?.new > 0 && (
              <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">
                +{stats.users.new} mới
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Người dùng</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
            </div>
            {stats?.products?.lowStock > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                {stats.products.lowStock} sắp hết
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Sản phẩm</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.products?.total || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="lg:col-span-2">
          <SalesChart revenueData={revenueData} topProductsData={topProductsChartData} />
        </div>
      </div>

      {/* Order Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <OrderStatusChart orderStatusData={orderStatusData} />
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 gap-5">
        <TopProducts products={topProducts} />
      </div>

      </div>
    </>
  );
};

export default AdminDashboardPage;
