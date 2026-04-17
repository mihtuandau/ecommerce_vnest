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

  getOne: async (id, params = {}) => {
    return await apiService.get(PRODUCT_ENDPOINTS.BY_ID(id), params);
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

  uploadVariantImages: async (variantId, files, metadata = {}) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (metadata.isPrimary !== undefined) {
      formData.append('isPrimary', metadata.isPrimary.toString());
    }
    if (metadata.displayOrder !== undefined) {
      formData.append('displayOrder', String(metadata.displayOrder));
    }

    return await apiService.upload(
      `/products/variant/${variantId}/images`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
  },

  deleteVariantImage: async (imageId) => {
    return await apiService.delete(`/products/variant-images/${imageId}`);
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

      const response = await apiService.get(PRODUCT_ENDPOINTS.RELATED(productId), { limit: 8 });
      return response.data || response || [];
    } catch (error) {

      const params = { page: 1, limit: 12, categoryId: categoryId || undefined };
      const res = await apiService.get(PRODUCT_ENDPOINTS.BASE, params);
      const products = res.data || res || [];
      return products.filter((p) => p.id !== productId).slice(0, 8);
    }
  },

  incrementView: async (productId) => {
    await apiService.post(PRODUCT_ENDPOINTS.VIEW(productId));
  },
};

export default productService;





