"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(String(variables)),
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.orders.detail(String(variables)),
      });
      success("Đã hủy đơn hàng thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi hủy đơn hàng");
    },
  });
}
