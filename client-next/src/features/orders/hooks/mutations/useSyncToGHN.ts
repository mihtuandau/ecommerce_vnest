"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useSyncToGHN() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => ordersApi.syncToGHN(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(String(variables)),
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.orders.detail(String(variables)),
      });
      success("Đã đồng bộ đơn hàng sang GHN thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi đồng bộ sang GHN");
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      paymentId,
      status,
      orderId,
    }: {
      paymentId: string;
      status: import("@/types/enums").PaymentStatus;
      orderId?: string;
    }) => ordersApi.updatePaymentStatus(paymentId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      const targetId = variables.orderId || String(data.orderId || "");
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(targetId) });
        queryClient.refetchQueries({ queryKey: queryKeys.orders.detail(targetId) });
      } else {
        queryClient.refetchQueries({ queryKey: queryKeys.orders.all });
      }
      success("Cập nhật trạng thái thanh toán thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật thanh toán");
    },
  });
}
