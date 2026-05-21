import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/types/models";
import { productsApi } from "../../api";

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
