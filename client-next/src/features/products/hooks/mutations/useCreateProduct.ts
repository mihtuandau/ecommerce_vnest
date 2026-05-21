import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/types/models";
import { productsApi } from "../../api";

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
