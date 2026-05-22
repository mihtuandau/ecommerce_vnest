"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { OrderStatus } from "@/types/enums";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(String(variables.id)),
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.orders.detail(String(variables.id)),
      });
      success("Cập nhật trạng thái đơn hàng thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật đơn hàng");
    },
  });
}
