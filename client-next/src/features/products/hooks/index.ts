import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useProducts(params?: Record<string, any>, options?: any) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getProducts(params as any),
    ...options,
  });
}

export function useProductDetail(slugOrId: string, allVariants = false) {
  return useQuery({
    queryKey: [...queryKeys.products.detail(String(slugOrId)), allVariants],
    queryFn: () => productsApi.getProduct(slugOrId, allVariants),
    enabled: !!slugOrId,
    staleTime: 5 * 60 * 1000, // Dữ liệu được coi là mới trong 5 phút
    gcTime: 10 * 60 * 1000,  // Lưu trong bộ nhớ đệm 10 phút
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      success("Thêm sản phẩm thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi thêm sản phẩm");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
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
    onError: (err: any) => {
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
    onError: (err: any) => {
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
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa sản phẩm");
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => productsApi.getCategories(),
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => productsApi.getBrands(),
  });
}

