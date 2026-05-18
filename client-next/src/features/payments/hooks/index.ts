"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function usePayments(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.payments.all, params],
    queryFn: () => paymentsApi.getPayments(params),
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      paymentsApi.updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      success("Cập nhật trạng thái thanh toán thành công!");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật trạng thái thanh toán");
    },
  });
}
