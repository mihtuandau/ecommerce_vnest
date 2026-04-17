import { useState, useEffect } from "react";
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import dashboardService from "../../../services/dashboardService";
import { notify } from "../../../utils/notification";
import Loading from "../../../components/common/Loading";
import RecentOrders from "../../../components/admin/Dashboard/RecentOrders";
import TopProducts from "../../../components/admin/Dashboard/TopProducts";
import SalesChart from "../../../components/admin/Dashboard/SalesChart";
import OrderStatusChart from "../../../components/admin/Dashboard/OrderStatusChart";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRevenueData = async (params = {}) => {
    try {
      const data = await dashboardService.getRevenue(params);
      setRevenue(data);
    } catch {
      notify.error("Không thể tải dữ liệu biểu đồ");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const now = new Date();
        const start = new Date();
        start.setDate(now.getDate() - 30);

        const [statsData, revenueData, ordersData, productsData] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getRevenue({
              startDate: start.toISOString(),
              endDate: now.toISOString(),
            }),
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
          notify.error("Không thể tải dữ liệu dashboard");
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
    type: revenue?.type,
    year: revenue?.year,
    month: revenue?.month,

    data:
      revenue?.data?.map((item) => ({
        label: item.label,
        revenue: item.revenue,
        orders: item.orders || 0,
      })) || [],

    monthly: revenue?.monthly || [],
    daily: revenue?.daily || [],
  };

  const orderStatusData = stats?.orders
    ? [
        {
          name: "Chờ xử lý",
          value: stats.orders.pending || 0,
          color: "#f59e0b",
        },
        {
          name: "Đang xử lý",
          value: stats.orders.processing || 0,
          color: "#3b82f6",
        },
        {
          name: "Đang giao",
          value: stats.orders.shipped || 0,
          color: "#8b5cf6",
        },
        {
          name: "Đã giao",
          value: stats.orders.delivered || 0,
          color: "#10b981",
        },
        {
          name: "Đã hủy",
          value: stats.orders.cancelled || 0,
          color: "#ef4444",
        },
      ].filter((item) => item.value > 0)
    : [];

  if (loading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." variant="admin" />;
  }

  return (
    <div className="p-5">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-500">
                  Doanh thu hôm nay
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-xl font-bold tracking-tight text-gray-800">
                    {stats?.revenue?.today
                      ? stats.revenue.today.toLocaleString("vi-VN")
                      : "0"}{" "}
                    ₫
                  </h3>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Doanh thu tích lũy:{" "}
                  {stats?.revenue?.total
                    ? stats.revenue.total.toLocaleString("vi-VN")
                    : "0"}{" "}
                  ₫
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div
              className={`flex items-center text-sm font-semibold ${stats?.revenue?.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats?.revenue?.change >= 0 ? (
                <TrendingUp size={16} className="mr-1.5" />
              ) : (
                <TrendingDown size={16} className="mr-1.5" />
              )}
              <span>
                {stats?.revenue?.change >= 0 ? "+" : ""}
                {stats?.revenue?.change}% so với hôm qua
              </span>
            </div>
          </div>

          {}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-500">
                  Đơn hàng hôm nay
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                  {stats?.orders?.today || 0}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {stats?.orders?.pending || 0} chờ xử lý ·{" "}
                  {stats?.orders?.shipped || 0} đang giao
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div
              className={`flex items-center text-sm font-semibold ${stats?.orders?.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats?.orders?.change >= 0 ? (
                <TrendingUp size={16} className="mr-1.5" />
              ) : (
                <TrendingDown size={16} className="mr-1.5" />
              )}
              <span>
                {stats?.orders?.change >= 0 ? "+" : ""}
                {stats?.orders?.change}% so với hôm qua
              </span>
            </div>
          </div>

          {}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-500">
                  Khách hàng mới hôm nay
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                  {stats?.users?.new || 0}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Tổng khách:{" "}
                  {stats?.users?.customers
                    ? stats.users.customers.toLocaleString("vi-VN")
                    : "0"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Users size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div
              className={`flex items-center text-sm font-semibold ${stats?.users?.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats?.users?.change >= 0 ? (
                <TrendingUp size={16} className="mr-1.5" />
              ) : (
                <TrendingDown size={16} className="mr-1.5" />
              )}
              <span>
                {stats?.users?.change >= 0 ? "+" : ""}
                {stats?.users?.change}% so với hôm qua
              </span>
            </div>
          </div>

          {}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-500">
                  Sản phẩm sắp hết
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                  {stats?.products?.lowStock || 0}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Cần nhập thêm hàng</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Package size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesChart
              revenueData={revenueData}
              onFilterChange={loadRevenueData}
            />
          </div>
          <div className="xl:col-span-1">
            <OrderStatusChart orderStatusData={orderStatusData} />
          </div>
        </div>

        {}
        <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <TopProducts products={topProducts} />
          </div>
          <div className="xl:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;






