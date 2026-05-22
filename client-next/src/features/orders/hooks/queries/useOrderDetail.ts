"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";
import { queryKeys } from "@/constants/queryKeys";

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 0, // Luôn refetch khi query được invalidate
  });
}

export function useGuestOrderDetail(orderCode: string, contact: string) {
  return useQuery({
    queryKey: [...queryKeys.orders.detail(orderCode), "guest", contact],
    queryFn: () => ordersApi.lookupGuestOrder(orderCode, contact),
    enabled: !!orderCode && !!contact,
    staleTime: 0,
  });
}
