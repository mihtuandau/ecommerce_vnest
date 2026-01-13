import apiService from "./apiService";
import { PRODUCT_ENDPOINTS } from "../config/apiConstants";
import categoryService from "./categoryService";
import brandService from "./brandService";


export const productService = {
  getPriceRange: async () => {
    return await apiService.get(PRODUCT_ENDPOINTS.PRICE_RANGE);
  },

  getAll: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return await apiService.get(PRODUCT_ENDPOINTS.BASE, cleanParams);
  },

  getOne: async (id) => {
    return await apiService.get(PRODUCT_ENDPOINTS.BY_ID(id));
  },

  create: async (productData) => {
    return await apiService.post(PRODUCT_ENDPOINTS.BASE, productData);
  },

  update: async (id, productData) => {
    return await apiService.put(PRODUCT_ENDPOINTS.BY_ID(id), productData);
  },

  delete: async (id) => {
    return await apiService.delete(PRODUCT_ENDPOINTS.BY_ID(id), { confirm: true });
  },

  bulkDelete: async (productIds) => {
    const response = await apiService.post(PRODUCT_ENDPOINTS.BULK_DELETE, {
      productIds,
      confirm: true,
    });
    return response.data;
  },

  addVariant: async (productId, variantData) => {
    return await apiService.post(
      `/products/${productId}/variant`,
      variantData
    );
  },

  updateVariant: async (variantId, variantData) => {
    return await apiService.put(`/products/variant/${variantId}`, variantData);
  },

  deleteVariant: async (variantId) => {
    return await apiService.delete(`/products/variant/${variantId}`);
  },
  uploadImages: async (productId, files, metadata = {}) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (metadata.altText) {
      formData.append('altText', metadata.altText);
    }
    if (metadata.isThumbnail !== undefined) {
      formData.append('isThumbnail', metadata.isThumbnail.toString());
    }
    if (metadata.variantId !== undefined && metadata.variantId !== null) {
      formData.append('variantId', String(metadata.variantId));
    }

    return await apiService.upload(
      `/products/${productId}/images`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
  },

  deleteImage: async (imageId) => {
    return await apiService.delete(`/products/images/${imageId}`);
  },

  getCategories: async () => {
    return await categoryService.getAll();
  },

  getBrands: async () => {
    return await brandService.getAll();
  },

  getRecommendations: async (productId, categoryId) => {
    try {
      const params = {
        page: 1,
        limit: 10,
        categoryId: categoryId || undefined,
      };
      const response = await apiService.get(PRODUCT_ENDPOINTS.BASE, params);
      const products = response.data || response || [];
      
      return products.filter(p => p.id !== productId).slice(0, 5);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  },
};

export default productService;