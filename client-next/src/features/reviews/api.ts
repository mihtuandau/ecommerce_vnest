import { api } from "@/lib/axios";

export const reviewsApi = {
  getProductReviews: async (productId: number, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  createReview: async (data: {
    productId: number;
    orderId?: number;
    rating: number;
    comment: string;
    images?: string[];
  }) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },

  canUserReview: async (productId: number, orderId: number) => {
    const response = await api.get(`/reviews/can-review/${productId}`, {
      params: { orderId },
    });
    return response.data;
  },

  getAllReviews: async (params: {
    page?: number;
    limit?: number;
    productId?: number;
    userId?: number;
  }) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  },

  getMyReviews: async (params: { page?: number; limit?: number } = {}) => {
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
