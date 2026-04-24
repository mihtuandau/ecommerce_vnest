"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discountsApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useDiscounts(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.discounts.all,
    queryFn: () => discountsApi.getDiscounts(params),
  });
}

export function useDiscountDetail(id: string) {
  return useQuery({
    queryKey: ["discounts", "detail", id],
    queryFn: () => discountsApi.getDiscount(id),
    enabled: !!id,
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => discountsApi.createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
      success("Tạo mã giảm giá thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi tạo mã giảm giá");
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      discountsApi.updateDiscount(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
      success("Cập nhật thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => discountsApi.deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
      success("Đã xóa mã giảm giá");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa");
    },
  });
}

export function useFlashSale() {
  return useQuery({
    queryKey: ["discounts", "flash-sale"],
    queryFn: () => discountsApi.getFlashSale(),
  });
}
