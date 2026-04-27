"use client";

import {
  useDashboardStats,
  useDashboardRevenue,
  useDashboardTopProducts,
  useDashboardRecentOrders,
} from "@/features/dashboard/hooks";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
import { OrderStatusChart } from "@/features/dashboard/components/OrderStatusChart";
import { TopProducts } from "@/features/dashboard/components/TopProducts";
import { RecentOrders } from "@/features/dashboard/components/RecentOrders";
import { usePermission } from "@/hooks/usePermission";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Skeleton } from "@/components/ui/Skeleton";

import dayjs from "@/lib/dayjs";

export default function AdminDashboardPage() {
  const { can, isLoading } = usePermission();
  
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: isRevenueLoading } = useDashboardRevenue();
  const { data: recentOrders, isLoading: isRecentOrdersLoading } = useDashboardRecentOrders();
  const { data: topProducts, isLoading: isTopProductsLoading } = useDashboardTopProducts();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-1/3 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!can("dashboard.view")) {
    return <AccessDenied permission="dashboard.view" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Tổng quan Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Chào mừng trở lại! Đây là tình hình kinh doanh của Minh Tuấn Shop hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded-lg font-bold text-xs h-10 text-slate-500"
            asChild
          >
            <Link href={ROUTES.ADMIN_ORDERS}>Xem báo cáo chi tiết</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats summary={stats} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <RevenueChart data={revenueData} isLoading={isRevenueLoading} />

        {/* Order Status Distribution */}
        <OrderStatusChart data={stats?.orders} isLoading={isStatsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <TopProducts products={topProducts} isLoading={isTopProductsLoading} />

        {/* Recent Orders */}
        <RecentOrders orders={recentOrders} isLoading={isRecentOrdersLoading} />
      </div>
    </div>
  );
}
