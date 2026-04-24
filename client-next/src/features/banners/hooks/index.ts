"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannersApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useBanners(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => bannersApi.getBanners(params),
  });
}

export function useBannerDetail(id: string) {
  return useQuery({
    queryKey: ["banners", "detail", id],
    queryFn: () => bannersApi.getBanner(id),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => bannersApi.createBanner(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      success("Thêm banner thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi thêm banner");
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      bannersApi.updateBanner(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      success("Cập nhật banner thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => bannersApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
      success("Đã xóa banner");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa");
    },
  });
}
