import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { returnsApi } from "@/features/returns/api/index";
import { returnQueryKeys } from "@/features/returns/hooks/queries";

export function useConfirmReturnSent() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: number) => returnsApi.confirmSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: returnQueryKeys.all });
      success("Xác nhận đã gửi hàng thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi xác nhận gửi hàng");
    },
  });
}
