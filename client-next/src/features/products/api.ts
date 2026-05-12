import { api } from "@/lib/axios";
import type { Product } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const productsApi = {
  getProducts: async (
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<PaginatedResponse<Product>> => {
    const { data: body } = await api.get<any>("/products", {
      params,
    });

    const data = Array.isArray(body) ? body : body.data || body.products || [];
    const meta = {
      total: body.meta?.total || body.total || data.length,
      page: body.meta?.page || body.page || 1,
      limit: body.meta?.limit || body.limit || 10,
      totalPages:
        body.meta?.totalPages ||
        body.totalPages ||
        Math.ceil((body.total || data.length) / (body.limit || 10)) ||
        1,
      hasNextPage: body.meta?.hasNextPage || body.hasNextPage || false,
      hasPrevPage: body.meta?.hasPrevPage || body.hasPrevPage || false,
    };

    return { data, meta };
  },

  getProduct: async (slugOrId: string, allVariants = false): Promise<Product> => {
    const { data: body } = await api.get<{ data?: Product } | Product>(
      `/products/${slugOrId}`,
      {
        params: allVariants ? { allVariants: "true" } : {},
      }
    );
    return (body as any)?.data || body;
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.post<Product>("/products", productData);
    return data;
  },

  updateProduct: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product> => {
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

  addVariant: async (
    productId: string,
    variantData: Partial<Product["variants"] extends Array<infer V> ? V : unknown>
  ): Promise<Product["variants"] extends Array<infer V> ? V : unknown> => {
    const { data } = await api.post(`/products/${productId}/variant`, variantData);
    return data;
  },

  updateVariant: async (
    variantId: string,
    variantData: Partial<Product["variants"] extends Array<infer V> ? V : unknown>
  ): Promise<Product["variants"] extends Array<infer V> ? V : unknown> => {
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

  getCategories: async (params?: Record<string, any>) => {
    const { data } = await api.get("/categories", { params });
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
