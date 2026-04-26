import { api } from "@/lib/axios";
import type { Product } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const productsApi = {
  getProducts: async (
    params?: Record<string, string>
  ): Promise<any> => {
    const { data: body } = await api.get<any>("/products", {
      params,
    });
    // Support various backend response structures
    if (Array.isArray(body)) return { data: body };
    if (body?.data && Array.isArray(body.data)) return body;
    if (body?.products && Array.isArray(body.products)) return { data: body.products };
    return body || { data: [] };
  },

  getProduct: async (slugOrId: string, allVariants = false): Promise<Product> => {
    const { data: body } = await api.get<any>(`/products/${slugOrId}`, {
      params: allVariants ? { allVariants: 'true' } : {}
    });
    return body?.data || body;
  },

  createProduct: async (productData: any): Promise<Product> => {
    const { data } = await api.post<Product>("/products", productData);
    return data;
  },

  updateProduct: async (id: string, productData: any): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  bulkDeleteProducts: async (productIds: string[]): Promise<void> => {
    await api.post("/products/bulk-delete", { productIds });
  },

  // ── Variant Management ──

  addVariant: async (productId: string, variantData: any) => {
    const { data } = await api.post(`/products/${productId}/variant`, variantData);
    return data;
  },

  updateVariant: async (variantId: string, variantData: any) => {
    const { data } = await api.put(`/products/variant/${variantId}`, variantData);
    return data;
  },

  deleteVariant: async (variantId: string) => {
    await api.delete(`/products/variant/${variantId}`);
  },

  // ── Image Management ──

  uploadImages: async (productId: string, formData: FormData) => {
    const { data } = await api.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteImage: async (imageId: string) => {
    await api.delete(`/products/images/${imageId}`);
  },

  // ── Categories & Brands ──

  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data;
  },

  getBrands: async () => {
    const { data } = await api.get("/brands");
    return data;
  },

  // ── Generic Upload ──
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);
    const { data } = await api.post("/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.urls?.[0] || data[0]; 
  },

  incrementView: async (id: string): Promise<void> => {
    await api.post(`/products/${id}/view`);
  },
};

