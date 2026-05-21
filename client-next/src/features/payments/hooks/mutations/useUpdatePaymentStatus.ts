import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { paymentsApi } from "@/features/payments/api/index";
import type { UpdatePaymentStatusPayload } from "@/features/payments/types";

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (payload: UpdatePaymentStatusPayload) =>
      paymentsApi.updatePaymentStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      success("Cập nhật trạng thái thanh toán thành công!");
    },
    onError: (err: any) => {
      error(
        err?.response?.data?.message ||
          "Lỗi khi cập nhật trạng thái thanh toán"
      );
    },
  });
}
