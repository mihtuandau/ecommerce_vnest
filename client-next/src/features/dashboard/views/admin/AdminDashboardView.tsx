"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import {
  DashboardStats,
  OrderStatusChart,
  PendingReviews,
  RecentOrders,
  RevenueChart,
  TopProducts,
} from "@/features/dashboard/components/admin";
import {
  useDashboardPendingReviews,
  useDashboardRecentOrders,
  useDashboardRevenue,
  useDashboardStats,
  useDashboardTopProducts,
} from "@/features/dashboard/hooks";
import { usePermission } from "@/hooks/usePermission";

export function AdminDashboardView() {
  const { can, isLoading } = usePermission();

  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: isRevenueLoading } = useDashboardRevenue();
  const { data: recentOrders, isLoading: isRecentOrdersLoading } =
    useDashboardRecentOrders();
  const { data: topProducts, isLoading: isTopProductsLoading } =
    useDashboardTopProducts();
  const { data: pendingReviews, isLoading: isPendingReviewsLoading } =
    useDashboardPendingReviews();

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">
            Tổng quan Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Chào mừng trở lại! Đây là tình hình kinh doanh của LUXE hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded-lg font-semibold text-sm h-10 text-slate-500"
            asChild
          >
            <Link href={ROUTES.ADMIN_ORDERS}>Xem báo cáo chi tiết</Link>
          </Button>
        </div>
      </div>

      <DashboardStats summary={stats} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart data={revenueData || []} isLoading={isRevenueLoading} />
        <OrderStatusChart data={stats?.orders as any} isLoading={isStatsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TopProducts products={topProducts} isLoading={isTopProductsLoading} />
        </div>

        <div className="lg:col-span-1">
          <PendingReviews
            reviews={pendingReviews}
            isLoading={isPendingReviewsLoading}
          />
        </div>
      </div>

      <div className="w-full">
        <RecentOrders orders={recentOrders || []} isLoading={isRecentOrdersLoading} />
      </div>
    </div>
  );
}
