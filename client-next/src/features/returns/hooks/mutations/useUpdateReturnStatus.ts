import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { returnsApi } from "@/features/returns/api/index";
import { RETURNS_MESSAGES } from "@/features/returns/constants/index";
import type { UpdateReturnStatusPayload } from "@/features/returns/types";
import { returnQueryKeys } from "@/features/returns/hooks/queries";

export function useUpdateReturnStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateReturnStatusPayload) =>
      returnsApi.updateReturnStatus(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: returnQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: returnQueryKeys.detail(variables.id),
      });
      success(RETURNS_MESSAGES.UPDATE_STATUS_SUCCESS);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || RETURNS_MESSAGES.UPDATE_STATUS_ERROR);
    },
  });
}
