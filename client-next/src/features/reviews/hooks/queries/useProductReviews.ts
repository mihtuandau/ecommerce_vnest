import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  product: (productId: number, page: number, limit: number) =>
    ["reviews", "product", productId, page, limit] as const,
  canReview: (productId: number, orderId: number) =>
    ["reviews", "can-review", productId, orderId] as const,
  aiSummary: (productId: number) => ["reviews", "ai-summary", productId] as const,
};

export const useProductReviews = (productId: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: reviewQueryKeys.product(productId, page, limit),
    queryFn: () => reviewsApi.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
};
