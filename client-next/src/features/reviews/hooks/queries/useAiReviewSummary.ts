import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";
import { reviewQueryKeys } from "./useProductReviews";

export const useAiReviewSummary = (productId: number) => {
  return useQuery({
    queryKey: reviewQueryKeys.aiSummary(productId),
    queryFn: () => reviewsApi.getAiReviewSummary(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
