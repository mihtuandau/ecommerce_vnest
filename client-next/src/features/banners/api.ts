import { api } from "@/lib/axios";
import type { Banner } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const bannersApi = {
  getBanners: async (
    params?: Record<string, any>
  ): Promise<PaginatedResponse<Banner>> => {
    const { data } = await api.get<PaginatedResponse<Banner>>("/banners", {
      params,
    });
    return data;
  },

  getBanner: async (id: string): Promise<Banner> => {
    const { data } = await api.get<Banner>(`/banners/${id}`);
    return data;
  },

  createBanner: async (formData: FormData): Promise<Banner> => {
    const { data } = await api.post<Banner>("/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateBanner: async (id: string, formData: FormData): Promise<Banner> => {
    const { data } = await api.put<Banner>(`/banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteBanner: async (id: string): Promise<void> => {
    await api.delete(`/banners/${id}`);
  },

  reorderBanner: async (id: string, displayOrder: number): Promise<void> => {
    await api.put(`/banners/${id}/reorder`, { displayOrder });
  },
};
