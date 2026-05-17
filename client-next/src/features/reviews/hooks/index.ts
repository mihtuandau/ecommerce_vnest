import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";

export const useProductReviews = (productId: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", "product", productId, page, limit],
    queryFn: () => reviewsApi.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { 
      productId: number; 
      orderId?: number; 
      rating: number; 
      comment: string; 
      images?: string[] 
    }) => reviewsApi.createReview(data),
    onSuccess: (_, variables) => {
      // Làm mới trạng thái kiểm tra quyền đánh giá
      queryClient.invalidateQueries({ queryKey: ["reviews", "can-review"] });
      
      // Làm mới danh sách đánh giá của sản phẩm
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", variables.productId] });
      
      // Làm mới tóm tắt AI (vì đã có dữ liệu mới)
      queryClient.invalidateQueries({ queryKey: ["reviews", "ai-summary", variables.productId] });
      
      // Làm mới danh sách và chi tiết đơn hàng để cập nhật trạng thái "Đã đánh giá"
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      if (variables.orderId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(String(variables.orderId)) });
      }
    },
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

export const useMyReviews = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["reviews", "my", params],
    queryFn: () => reviewsApi.getMyReviews(params),
  });
};

export const useAiReviewSummary = (productId: number) => {
  return useQuery({
    queryKey: ["reviews", "ai-summary", productId],
    queryFn: () => reviewsApi.getAiReviewSummary(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
export const useLatestReviews = () => {
  return useQuery({
    queryKey: ["reviews", "latest"],
    queryFn: () => reviewsApi.getLatestReviews(),
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

