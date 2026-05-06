"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";

export function useReportSummary(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["reports", "summary", params],
    queryFn: () => reportsApi.getSummary(params),
  });
}

export function useRevenueReport(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["reports", "revenue", params],
    queryFn: () => reportsApi.getRevenue(params),
  });
}

export function useTopProducts(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["reports", "top-products", params],
    queryFn: () => reportsApi.getTopProducts(params),
  });
}
