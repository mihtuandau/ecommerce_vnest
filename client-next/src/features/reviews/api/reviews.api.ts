import { api } from "@/lib/http";
import type {
  CreateReviewPayload,
  MyReviewsQueryParams,
  ReviewsQueryParams,
} from "@/features/reviews/types";

export const reviewsApi = {
  getProductReviews: async (productId: number, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  createReview: async (payload: CreateReviewPayload) => {
    const response = await api.post("/reviews", payload);
    return response.data;
  },

  canUserReview: async (productId: number, orderId: number) => {
    const response = await api.get(`/reviews/can-review/${productId}`, {
      params: { orderId },
    });
    return response.data;
  },

  getAllReviews: async (params: ReviewsQueryParams) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  },

  getMyReviews: async (params: MyReviewsQueryParams = {}) => {
    const response = await api.get("/reviews/my-reviews", { params });
    return response.data;
  },

  getAiReviewSummary: async (productId: number) => {
    const response = await api.get(`/reviews/product/${productId}/ai-summary`);
    return response.data;
  },

  getLatestReviews: async () => {
    const response = await api.get("/reviews/public/latest");
    return response.data;
  },

  deleteReview: async (id: number) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
