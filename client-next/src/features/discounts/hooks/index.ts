"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discountsApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { mapDiscountMutationValues } from "@/features/discounts/services";

// ── Customer: chỉ lấy voucher (không Flash Sale) ──
export function useDiscounts(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: [...queryKeys.discounts.all, "public", params],
    queryFn: () => discountsApi.getDiscounts(params),
  });
}

// ── Admin: lấy TẤT CẢ mã giảm giá (bao gồm cả Flash Sale) ──
export function useAdminDiscounts(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: [...queryKeys.discounts.all, "admin", params],
    queryFn: () => discountsApi.getDiscounts({ ...params, manage: true }),
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
    mutationFn: (values: any) => {
      return discountsApi.createDiscount(mapDiscountMutationValues(values));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
      success("Tạo chương trình thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi tạo chương trình");
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data: values }: { id: string; data: any }) => {
      return discountsApi.updateDiscount(id, mapDiscountMutationValues(values));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
      success("Cập nhật thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err.response?.data?.message || "Cập nhật thất bại");
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
      success("Đã xóa chương trình");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi xóa");
    },
  });
}

// ── Customer: lấy Flash Sale đang diễn ra (sản phẩm + countdown) ──
export function useFlashSale() {
  return useQuery({
    queryKey: ["discounts", "flash-sale"],
    queryFn: () => discountsApi.getFlashSale(),
  });
}
