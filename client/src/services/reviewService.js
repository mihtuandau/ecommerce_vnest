import apiService from './apiService';
import { REVIEW_ENDPOINTS } from '../config/apiConstants';

const reviewService = {
  async canUserReview(productId, orderId) {
    const response = await apiService.get(`${REVIEW_ENDPOINTS.BASE}/can-review/${productId}?orderId=${orderId}`);
    return response;
  },

  async getMyReview(productId, orderId) {
    const response = await apiService.get(`${REVIEW_ENDPOINTS.BASE}/my-review/${productId}?orderId=${orderId}`);
    return response;
  },

  async createReview(productId, orderId, rating, comment, images = []) {
    const response = await apiService.post(
      REVIEW_ENDPOINTS.BASE,
      { productId, orderId, rating, comment, images }
    );
    return response;
  },

  async getProductReviews(productId, page = 1, limit = 10) {
    const response = await apiService.get(
      `${REVIEW_ENDPOINTS.BY_PRODUCT(productId)}?page=${page}&limit=${limit}`
    );
    return response;
  },

  async updateReview(reviewId, userId, rating, comment, images) {
    const response = await apiService.put(
      `${REVIEW_ENDPOINTS.BY_ID(reviewId)}?userId=${userId}`,
      { rating, comment, images }
    );
    return response;
  },

  async deleteReview(reviewId, userId) {
    const response = await apiService.delete(
      `${REVIEW_ENDPOINTS.BY_ID(reviewId)}?userId=${userId}`
    );
    return response;
  },
};

export default reviewService;
