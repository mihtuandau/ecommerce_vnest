import apiService from './apiService';
import { CATEGORY_ENDPOINTS } from '../config/apiConstants';

const categoryService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get(CATEGORY_ENDPOINTS.BASE, params);
      return response;
    } catch (error) {return [];
    }
  },

  getOne: async (id) => {
    const response = await apiService.get(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  },

  create: async (formData) => {
    const response = await apiService.upload(CATEGORY_ENDPOINTS.BASE, formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  },

  update: async (id, formData) => {
    const response = await apiService.upload(CATEGORY_ENDPOINTS.BY_ID(id), formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiService.delete(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiService.upload(CATEGORY_ENDPOINTS.UPLOAD_IMAGE, formData, {
      'Content-Type': 'multipart/form-data'
    });
    return response;
  }
};

export default categoryService;
