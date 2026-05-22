"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";
import type {
  DashboardPendingReview,
  DashboardRevenuePoint,
  DashboardStatsSummary,
  DashboardTopProduct,
} from "@/features/dashboard/types";
import type { Order } from "@/types/models";

export function useDashboardStats() {
  return useQuery<DashboardStatsSummary>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
  });
}

export function useDashboardRevenue(params?: Record<string, any>) {
  return useQuery<DashboardRevenuePoint[]>({
    queryKey: ["dashboard", "revenue", params],
    queryFn: () => dashboardApi.getRevenue(params),
  });
}

export function useDashboardRecentOrders() {
  return useQuery<Order[]>({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: () => dashboardApi.getRecentOrders(),
  });
}

export function useDashboardTopProducts() {
  return useQuery<DashboardTopProduct[]>({
    queryKey: ["dashboard", "top-products"],
    queryFn: () => dashboardApi.getTopProducts(),
  });
}

export function useDashboardPendingReviews() {
  return useQuery<DashboardPendingReview[]>({
    queryKey: ["dashboard", "pending-reviews"],
    queryFn: () => dashboardApi.getPendingReviews(),
  });
}
