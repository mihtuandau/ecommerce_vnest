import axiosInstance from '../config/api.config';

const bannerService = {
  /**
   * Get all banners for homepage (active only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/banners', { 
        params: { active: true, ...params }
      });
      return response.data;
    } catch (error) {return [];
    }
  },

  /**
   * Get banner by ID
   */
  getOne: async (id) => {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response.data;
  },

  /**
   * Create new banner with image (Admin only)
   * @param {FormData} formData - FormData with title, subtitle, image file, etc.
   */
  create: async (formData) => {
    const response = await axiosInstance.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Update banner with optional new image (Admin only)
   */
  update: async (id, formData) => {
    const response = await axiosInstance.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Delete banner (Admin only)
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/banners/${id}`);
    return response.data;
  },

  /**
   * Reorder banner (Admin only)
   */
  reorder: async (id, order) => {
    const response = await axiosInstance.put(`/banners/${id}/reorder`, { order });
    return response.data;
  },

  /**
   * Upload banner image only (Admin only)
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/banners/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default bannerService;
