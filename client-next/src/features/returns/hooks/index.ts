"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnsApi } from "../api";
import { useToast } from "@/hooks/useToast";
import { ReturnStatus } from "@/types/enums";

export function useUpdateReturnStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: number;
      status: ReturnStatus;
      adminNote?: string;
    }) => returnsApi.updateReturnStatus(id, { status, adminNote }),
    onSuccess: (data, variables) => {
      // Invalidate both the order detail and the return list
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      success("Cập nhật tiến trình thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật tiến trình");
    },
  });
}

export function useConfirmReturnSent() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: number) => returnsApi.confirmSent(id),
    onSuccess: () => {
      // Invalidate both the order detail and the return list
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      success("Xác nhận đã gửi hàng thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi xác nhận gửi hàng");
    },
  });
}
