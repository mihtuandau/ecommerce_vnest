import { api } from "@/lib/axios";
import type { Discount } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const discountsApi = {
  getDiscounts: async (
    params?: Record<string, any>
  ): Promise<PaginatedResponse<Discount>> => {
    const { data } = await api.get<PaginatedResponse<Discount>>("/discounts", {
      params,
    });
    return data;
  },

  getDiscount: async (id: string): Promise<Discount> => {
    const { data } = await api.get<Discount>(`/discounts/${id}`);
    return data;
  },

  createDiscount: async (discountData: any): Promise<Discount> => {
    const { data } = await api.post<Discount>("/discounts", discountData);
    return data;
  },

  updateDiscount: async (id: string, discountData: any): Promise<Discount> => {
    const { data } = await api.patch<Discount>(`/discounts/${id}`, discountData);
    return data;
  },

  deleteDiscount: async (id: string): Promise<void> => {
    await api.delete(`/discounts/${id}`);
  },

  validateDiscount: async (code: string): Promise<Discount> => {
    const { data } = await api.post<Discount>("/discounts/validate", { code });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/discounts/stats");
    return data;
  },

  getFlashSale: async () => {
    const { data } = await api.get("/discounts/flash-sale");
    return data;
  },
};
