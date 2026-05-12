"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useCategories(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, params],
    queryFn: () => categoriesApi.getCategories(params),
  });
}

export function useCategoryDetail(id: string | number) {
  return useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => categoriesApi.createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      success("Thêm danh mục thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi thêm danh mục");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: FormData }) =>
      categoriesApi.updateCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      success("Cập nhật danh mục thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      success("Đã xóa danh mục");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa");
    },
  });
}
