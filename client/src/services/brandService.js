import apiService from './apiService';
import { BRAND_ENDPOINTS } from '../config/apiConstants';

const brandService = {
  // Get all brands
  getBrands: async () => {
    const response = await apiService.get(BRAND_ENDPOINTS.BASE);
    return response;
  },

  // Get single brand
  getBrand: async (id) => {
    const response = await apiService.get(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  },

  // Create brand
  createBrand: async (data) => {
    const response = await apiService.post(BRAND_ENDPOINTS.BASE, data);
    return response;
  },

  // Update brand
  updateBrand: async (id, data) => {
    const response = await apiService.put(BRAND_ENDPOINTS.BY_ID(id), data);
    return response;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await apiService.delete(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  },
};

export default brandService;
