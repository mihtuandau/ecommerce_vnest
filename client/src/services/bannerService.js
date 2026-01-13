import apiService from './apiService';
import { BANNER_ENDPOINTS } from '../config/apiConstants';

const bannerService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get(BANNER_ENDPOINTS.BASE, { active: true, ...params });
      return response;
    } catch (error) {return [];
    }
  },

  getOne: async (id) => {
    const response = await apiService.get(BANNER_ENDPOINTS.BY_ID(id));
    return response;
  },

  /**
   * Create new banner with image (Admin only)
   * @param {FormData} formData - FormData with title, subtitle, image file, etc.
   */
  create: async (formData) => {
    const response = await apiService.upload(BANNER_ENDPOINTS.BASE, formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  },

  update: async (id, formData) => {
    const response = await apiService.uploadPut(BANNER_ENDPOINTS.BY_ID(id), formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiService.delete(BANNER_ENDPOINTS.BY_ID(id));
    return response;
  },

  reorder: async (id, order) => {
    const response = await apiService.put(BANNER_ENDPOINTS.REORDER(id), { order });
    return response;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiService.upload(BANNER_ENDPOINTS.UPLOAD_IMAGE, formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  }
};

export default bannerService;
