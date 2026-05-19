import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api";
import type { Product } from "@/types/models";

import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useProducts(
  params?: Record<string, string | number | boolean | undefined>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, string>),
    queryFn: () => productsApi.getProducts(params),
    ...options,
  });
}

export function useProductDetail(slugOrId: string, allVariants = false) {
  return useQuery({
    queryKey: [...queryKeys.products.detail(String(slugOrId)), allVariants],
    queryFn: () => productsApi.getProduct(slugOrId, allVariants),
    enabled: !!slugOrId,
    staleTime: 0, // Luôn lấy dữ liệu mới khi vào trang chi tiết
    gcTime: 5 * 60 * 1000, // Lưu trong bộ nhớ đệm 5 phút
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Product>) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      success("Thêm sản phẩm thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi thêm sản phẩm");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(String(data.id)),
      });
      if (data.slug) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.detail(String(data.slug)),
        });
      }
      success("Cập nhật sản phẩm thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      success("Xóa sản phẩm thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi xóa sản phẩm");
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (ids: string[]) => productsApi.bulkDeleteProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      success("Xóa các sản phẩm đã chọn thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi xóa sản phẩm");
    },
  });
}

export function useCategories(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, params],
    queryFn: () => productsApi.getCategories(params),
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => productsApi.getBrands(),
  });
}

export function useIncrementView() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.incrementView(id),
    onSuccess: (_, id) => {
      // Invalidate both the list and the detail to show the new view count
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
