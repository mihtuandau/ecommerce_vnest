"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { OrderStatus, PaymentStatus } from "@/types/enums";

export function useOrders(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useMyOrders(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.orders.list(params), "my-orders"],
    queryFn: () => ordersApi.getMyOrders(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 0, // Luôn refetch khi query được invalidate
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalidate bằng cả id từ variables (string) để chắc chắn khớp key
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(String(variables.id)) });
      // Refetch ngay lập tức để UI cập nhật không cần F5
      queryClient.refetchQueries({ queryKey: queryKeys.orders.detail(String(variables.id)) });
      success("Cập nhật trạng thái đơn hàng thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật đơn hàng");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(String(variables)) });
      queryClient.refetchQueries({ queryKey: queryKeys.orders.detail(String(variables)) });
      success("Đã hủy đơn hàng thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi hủy đơn hàng");
    },
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: () => ordersApi.getStats(),
  });
}

export function useSyncToGHN() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => ordersApi.syncToGHN(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(String(variables)) });
      queryClient.refetchQueries({ queryKey: queryKeys.orders.detail(String(variables)) });
      success("Đã đồng bộ đơn hàng sang GHN thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi đồng bộ sang GHN");
    },
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

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ paymentId, status, orderId }: { paymentId: string; status: PaymentStatus; orderId?: string }) =>
      ordersApi.updatePaymentStatus(paymentId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      // Dùng orderId từ variables nếu có, fallback sang data.orderId
      const targetId = variables.orderId || String(data.orderId || "");
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(targetId) });
        queryClient.refetchQueries({ queryKey: queryKeys.orders.detail(targetId) });
      } else {
        // Nếu không biết id cụ thể, refetch toàn bộ orders
        queryClient.refetchQueries({ queryKey: queryKeys.orders.all });
      }
      success("Cập nhật trạng thái thanh toán thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật thanh toán");
    },
  });
}
