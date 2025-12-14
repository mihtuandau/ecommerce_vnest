import apiService from './apiService';
import { BANNER_ENDPOINTS } from '../config/apiConstants';

const bannerService = {
  /**
   * Get all banners for homepage (active only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get(BANNER_ENDPOINTS.BASE, { active: true, ...params });
      return response;
    } catch (error) {return [];
    }
  },

  /**
   * Get banner by ID
   */
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

  /**
   * Update banner with optional new image (Admin only)
   */
  update: async (id, formData) => {
    const response = await apiService.upload(BANNER_ENDPOINTS.BY_ID(id), formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  },

  /**
   * Delete banner (Admin only)
   */
  delete: async (id) => {
    const response = await apiService.delete(BANNER_ENDPOINTS.BY_ID(id));
    return response;
  },

  /**
   * Reorder banner (Admin only)
   */
  reorder: async (id, order) => {
    const response = await apiService.put(BANNER_ENDPOINTS.REORDER(id), { order });
    return response;
  },

  /**
   * Upload banner image only (Admin only)
   */
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
