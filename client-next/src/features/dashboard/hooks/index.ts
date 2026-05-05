"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
  });
}

export function useDashboardRevenue(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["dashboard", "revenue", params],
    queryFn: () => dashboardApi.getRevenue(params),
  });
}

export function useDashboardRecentOrders() {
  return useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: () => dashboardApi.getRecentOrders(),
  });
}

export function useDashboardTopProducts() {
  return useQuery({
    queryKey: ["dashboard", "top-products"],
    queryFn: () => dashboardApi.getTopProducts(),
  });
}

export function useDashboardPendingReviews() {
  return useQuery({
    queryKey: ["dashboard", "pending-reviews"],
    queryFn: () => dashboardApi.getPendingReviews(),
  });
}
