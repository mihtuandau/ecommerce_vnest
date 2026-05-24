import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { reviewsApi } from "@/features/reviews/api/index";
import type { CreateReviewPayload } from "@/features/reviews/types";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "can-review"] });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      if (variables.orderId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.detail(String(variables.orderId)),
        });
      }
    },
  });
};
