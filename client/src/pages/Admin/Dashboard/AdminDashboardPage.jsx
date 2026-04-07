import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import TopProducts from '../../../components/admin/Dashboard/TopProducts';
import SalesChart from '../../../components/admin/Dashboard/SalesChart';
import OrderStatusChart from '../../../components/admin/Dashboard/OrderStatusChart';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch {
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



  if (loading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." variant="admin" />;
  }

  return (
    <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-500 text-base font-medium mb-2">Doanh thu hôm nay</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {stats?.revenue?.total ? (stats.revenue.total / 1000000).toLocaleString('vi-VN') : '0'}
                  </h3>
                  <span className="text-xl font-bold text-gray-800">Mđ</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Đơn đã giao hôm nay</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center text-sm font-semibold text-green-500">
              <TrendingUp size={16} className="mr-1.5" />
              <span>+12.5% so với hôm qua</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-500 text-base font-medium mb-2">Đơn hàng mới</p>
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{stats?.orders?.total || 0}</h3>
                <p className="text-gray-400 text-sm mt-1">{stats?.orders?.pending || 0} chờ xử lý · {stats?.orders?.shipped || 0} đang giao</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center text-sm font-semibold text-green-500">
              <TrendingUp size={16} className="mr-1.5" />
              <span>+5% so với hôm qua</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-500 text-base font-medium mb-2">Khách hàng mới</p>
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{stats?.users?.new || 0}</h3>
                <p className="text-gray-400 text-sm mt-1">Tổng tích lũy: {stats?.users?.total ? stats.users.total.toLocaleString('vi-VN') : '0'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <Users size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center text-sm font-semibold text-red-500">
              <TrendingDown size={16} className="mr-1.5" />
              <span>-2% so với hôm qua</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-500 text-base font-medium mb-2">Sản phẩm sắp hết</p>
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{stats?.products?.lowStock || 0}</h3>
                <p className="text-gray-400 text-sm mt-1">Cần nhập thêm hàng</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Package size={24} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: SalesChart (left ~65%) + OrderStatusChart (right ~35%) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2">
            <SalesChart revenueData={revenueData} />
          </div>
          <div className="xl:col-span-1">
            <OrderStatusChart orderStatusData={orderStatusData} />
          </div>
        </div>

        {/* Row 3: TopProducts (left ~35%) + RecentOrders (right ~65%) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-1">
            <TopProducts products={topProducts} />
          </div>
          <div className="xl:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>
        </div>
      </div>
  );
};

export default AdminDashboardPage;
