import { api } from "@/lib/axios";
import type { Discount } from "@/types/models";

export const discountsApi = {
  getDiscounts: async (
    params?: Record<string, any>
  ): Promise<any> => {
    // manage: true → admin endpoint, otherwise → public (customer) endpoint
    const isAdmin = params?.manage;
    const endpoint = isAdmin ? "/discounts" : "/discounts/public";

    // Không gửi "manage" lên server (server không biết field này)
    const { manage, ...serverParams } = params || {};

    const { data: body } = await api.get<any>(endpoint, {
      params: serverParams,
    });

    // Robust unwrapping
    if (Array.isArray(body)) return { data: body };
    if (body?.data && Array.isArray(body.data)) return body;
    return body;
  },

  getDiscount: async (id: string): Promise<Discount> => {
    const { data: body } = await api.get<any>(`/discounts/${id}`);
    return body?.data || body;
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

  validateDiscount: async (code: string): Promise<any> => {
    const { data } = await api.post<any>("/discounts/validate", { code });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/discounts/stats");
    return data;
  },

  getFlashSale: async () => {
    const { data: body } = await api.get<any>("/discounts/flash-sale");
    return body?.data || body;
  },
};
