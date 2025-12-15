import apiService from "./apiService";
import { PRODUCT_ENDPOINTS } from "../config/apiConstants";
import categoryService from "./categoryService";


// Sử dụng named exports thay vì default export
export const productService = {
  // Get price range
  getPriceRange: async () => {
    return await apiService.get(PRODUCT_ENDPOINTS.PRICE_RANGE);
  },

  // Get all products với pagination và filters
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = "", categoryId = "" } = params;
    return await apiService.get(PRODUCT_ENDPOINTS.BASE, {
        page,
        limit,
        search,
        categoryId: categoryId || undefined,
      });
  },

  // Get single product by ID
  getOne: async (id) => {
    return await apiService.get(PRODUCT_ENDPOINTS.BY_ID(id));
  },

  // Create new product
  create: async (productData) => {
    return await apiService.post(PRODUCT_ENDPOINTS.BASE, productData);
  },

  // Update product
  update: async (id, productData) => {
    return await apiService.put(PRODUCT_ENDPOINTS.BY_ID(id), productData);
  },

  // Delete product
  delete: async (id) => {
    return await apiService.delete(PRODUCT_ENDPOINTS.BY_ID(id), { confirm: true });
  },

  // Bulk delete products
  bulkDelete: async (productIds) => {
    const response = await apiService.post(PRODUCT_ENDPOINTS.BULK_DELETE, {
      productIds,
      confirm: true,
    });
    return response.data;
  },

  // Add variant to product
  addVariant: async (productId, variantData) => {
    return await apiService.post(
      `/products/${productId}/variant`,
      variantData
    );
  },

  // Update an existing variant
  updateVariant: async (variantId, variantData) => {
    return await apiService.put(`/products/variant/${variantId}`, variantData);
  },

  // Delete a variant by its ID
  deleteVariant: async (variantId) => {
    return await apiService.delete(`/products/variant/${variantId}`);
  },

  // ============ UPLOAD ẢNH TỪ MÁY TÍNH ============
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

  // Xóa ảnh sản phẩm
  deleteImage: async (imageId) => {
    return await apiService.delete(`/products/images/${imageId}`);
  },

  // Get categories
  getCategories: async () => {
    return await categoryService.getAll();
  },

  // Get brands
  getBrands: async () => {
    return await brandService.getAll();
  },
};

// Hoặc nếu bạn muốn dùng default export, sửa import statement
export default productService;