import apiService from './apiService';

const reviewService = {
  // Kiểm tra có thể review không
  async canUserReview(productId) {
    const response = await apiService.get(`/reviews/can-review/${productId}`);
    return response;
  },

  // Tạo review mới (userId sẽ được lấy từ JWT token ở backend)
  async createReview(productId, userId, rating, comment, images = []) {
    const response = await apiService.post(
      `/reviews`,
      { productId, rating, comment, images }
    );
    return response;
  },

  // Lấy danh sách reviews của sản phẩm
  async getProductReviews(productId, page = 1, limit = 10) {
    const response = await apiService.get(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`
    );
    return response;
  },

  // Cập nhật review
  async updateReview(reviewId, userId, rating, comment, images) {
    const response = await apiService.put(
      `/reviews/${reviewId}?userId=${userId}`,
      { rating, comment, images }
    );
    return response;
  },

  // Xóa review
  async deleteReview(reviewId, userId) {
    const response = await apiService.delete(
      `/reviews/${reviewId}?userId=${userId}`
    );
    return response;
  },
};

export default reviewService;
