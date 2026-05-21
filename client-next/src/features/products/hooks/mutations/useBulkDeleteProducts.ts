import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { productsApi } from "../../api";

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
