import apiService from './apiService';
import { REVIEW_ENDPOINTS } from '../config/apiConstants';

const reviewService = {
  // Kiểm tra có thể review không
  async canUserReview(productId) {
    const response = await apiService.get(`${REVIEW_ENDPOINTS.BASE}/can-review/${productId}`);
    return response;
  },

  // Tạo review mới (userId sẽ được lấy từ JWT token ở backend)
  async createReview(productId, userId, rating, comment, images = []) {
    const response = await apiService.post(
      REVIEW_ENDPOINTS.BASE,
      { productId, rating, comment, images }
    );
    return response;
  },

  // Lấy danh sách reviews của sản phẩm
  async getProductReviews(productId, page = 1, limit = 10) {
    const response = await apiService.get(
      `${REVIEW_ENDPOINTS.BY_PRODUCT(productId)}?page=${page}&limit=${limit}`
    );
    return response;
  },

  // Cập nhật review
  async updateReview(reviewId, userId, rating, comment, images) {
    const response = await apiService.put(
      `${REVIEW_ENDPOINTS.BY_ID(reviewId)}?userId=${userId}`,
      { rating, comment, images }
    );
    return response;
  },

  // Xóa review
  async deleteReview(reviewId, userId) {
    const response = await apiService.delete(
      `${REVIEW_ENDPOINTS.BY_ID(reviewId)}?userId=${userId}`
    );
    return response;
  },
};

export default reviewService;
