import { api } from "@/lib/http";
import type { Category } from "@/types/models";

export const categoriesApi = {
  getCategories: async (params?: Record<string, unknown>): Promise<Category[]> => {
    const { data } = await api.get<Category[]>("/categories", {
      params,
    });
    return data;
  },

  getCategory: async (id: string | number): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  createCategory: async (formData: FormData): Promise<Category> => {
    const { data } = await api.post<Category>("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateCategory: async (
    id: string | number,
    formData: FormData
  ): Promise<Category> => {
    const { data } = await api.put<Category>(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteCategory: async (id: string | number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
