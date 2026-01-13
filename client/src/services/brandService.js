import apiService from './apiService';
import { BRAND_ENDPOINTS } from '../config/apiConstants';

const brandService = {
  getBrands: async () => {
    const response = await apiService.get(BRAND_ENDPOINTS.BASE);
    return response;
  },

  getBrand: async (id) => {
    const response = await apiService.get(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  },

  createBrand: async (data) => {
    const response = await apiService.post(BRAND_ENDPOINTS.BASE, data);
    return response;
  },

  updateBrand: async (id, data) => {
    const response = await apiService.put(BRAND_ENDPOINTS.BY_ID(id), data);
    return response;
  },

  deleteBrand: async (id) => {
    const response = await apiService.delete(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  },
};

export default brandService;
