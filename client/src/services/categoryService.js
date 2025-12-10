import axiosInstance from '../config/api.config';

const categoryService = {
  // Get all categories
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/categories', { params });
      return response.data;
    } catch (error) {return [];
    }
  },

  // Get single category
  getOne: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  // Create category with image
  create: async (formData) => {
    const response = await axiosInstance.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update category with optional image
  update: async (id, formData) => {
    const response = await axiosInstance.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete category
  delete: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },

  // Upload category image only
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/categories/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default categoryService;
