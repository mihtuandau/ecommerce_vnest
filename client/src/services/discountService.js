import apiService from './apiService';
import { DISCOUNT_ENDPOINTS } from '../config/apiConstants';

const discountService = {
  getDiscounts: async (params = {}) => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.BASE, params);
    return response;
  },

  getDiscount: async (id) => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  },

  getFlashSale: async () => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.FLASH_SALE);
    return response;
  },

  getAutoApply: async () => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.AUTO_APPLY);
    return response;
  },

  createDiscount: async (data) => {
    const response = await apiService.post(DISCOUNT_ENDPOINTS.BASE, data);
    return response;
  },

  updateDiscount: async (id, data) => {
    const response = await apiService.patch(DISCOUNT_ENDPOINTS.BY_ID(id), data);
    return response;
  },

  deleteDiscount: async (id) => {
    const response = await apiService.delete(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  },

  validateDiscount: async (code) => {
    const response = await apiService.post(DISCOUNT_ENDPOINTS.VALIDATE, { code });
    return response;
  },
  getStats: async () => {
    const response = await apiService.get(DISCOUNT_ENDPOINTS.STATS);
    return response;
  },
};

export default discountService;
