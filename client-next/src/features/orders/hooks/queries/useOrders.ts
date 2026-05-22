"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";
import { queryKeys } from "@/constants/queryKeys";

export function useOrders(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.orders.list(params as any),
    queryFn: () => ordersApi.getOrders(params as Record<string, string>),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useMyOrders(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: [...queryKeys.orders.list(params as any), "my-orders"],
    queryFn: () => ordersApi.getMyOrders(params as Record<string, string>),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
