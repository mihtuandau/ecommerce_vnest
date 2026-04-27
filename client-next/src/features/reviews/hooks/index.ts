import { useQuery, useMutation } from "@tanstack/react-query";
import { reviewsApi } from "../api";

export const useProductReviews = (productId: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", "product", productId, page, limit],
    queryFn: () => reviewsApi.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (data: any) => reviewsApi.createReview(data),
  });
};

export const useCanReview = (productId: number, orderId: number) => {
  return useQuery({
    queryKey: ["reviews", "can-review", productId, orderId],
    queryFn: () => reviewsApi.canUserReview(productId, orderId),
    enabled: !!productId && !!orderId,
  });
};

export const useAllReviews = (params: { page?: number; limit?: number; productId?: number; userId?: number }) => {
  return useQuery({
    queryKey: ["reviews", "all", params],
    queryFn: () => reviewsApi.getAllReviews(params),
  });
};
