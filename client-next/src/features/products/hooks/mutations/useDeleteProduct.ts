import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { productsApi } from "../../api";

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
