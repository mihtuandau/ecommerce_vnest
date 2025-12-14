import apiService from './apiService';
import { DISCOUNT_ENDPOINTS } from '../config/apiConstants';

const discountService = {
  // Lấy danh sách mã giảm giá
  getDiscounts: async (params = {}) => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.BASE, params);
    return response;
  },

  // Lấy chi tiết mã giảm giá
  getDiscount: async (id) => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  },

  // Tạo mã giảm giá mới (Admin)
  createDiscount: async (data) => {
    const response = await apiService.post(DISCOUNT_ENDPOINTS.BASE, data);
    return response;
  },

  // Cập nhật mã giảm giá (Admin)
  updateDiscount: async (id, data) => {
    const response = await apiService.patch(DISCOUNT_ENDPOINTS.BY_ID(id), data);
    return response;
  },

  // Xóa mã giảm giá (Admin)
  deleteDiscount: async (id) => {
    const response = await apiService.delete(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  },

  // Validate mã giảm giá
  validateDiscount: async (code) => {
    const response = await apiService.post(DISCOUNT_ENDPOINTS.VALIDATE, { code });
    return response;
  },

  // Lấy thống kê (Admin)
  getStats: async () => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.STATS);
    return response;
  },
};

export default discountService;
