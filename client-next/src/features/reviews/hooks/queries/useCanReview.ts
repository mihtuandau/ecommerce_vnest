import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";
import { reviewQueryKeys } from "./useProductReviews";

export const useCanReview = (productId: number, orderId: number) => {
  return useQuery({
    queryKey: reviewQueryKeys.canReview(productId, orderId),
    queryFn: () => reviewsApi.canUserReview(productId, orderId),
    enabled: !!productId && !!orderId,
  });
};
