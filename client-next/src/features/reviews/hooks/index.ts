import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "../api";

export const useProductReviews = (productId: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", "product", productId, page, limit],
    queryFn: () => reviewsApi.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
};
