import { api } from "@/lib/axios";
import type { Discount } from "@/types/models";

export const discountsApi = {
  getDiscounts: async (
    params?: Record<string, string | number | boolean>
  ): Promise<{ data: Discount[]; total?: number }> => {
    // manage: true → admin endpoint, otherwise → public (customer) endpoint
    const isAdmin = params?.manage;
    const endpoint = isAdmin ? "/discounts" : "/discounts/public";

    // Không gửi "manage" lên server (server không biết field này)
    const { manage, ...serverParams } = params || {};

    const { data: body } = await api.get<any>(endpoint, {
      params: serverParams,
    });

    if (Array.isArray(body)) return { data: body };
    if (body && typeof body === 'object' && Array.isArray(body.data)) {
      return { data: body.data, total: body.total };
    }
    return { data: [] };
  },

  getDiscount: async (id: string): Promise<Discount> => {
    const { data: body } = await api.get<any>(`/discounts/${id}`);
    return body?.data || body;
  },

  createDiscount: async (discountData: Partial<Discount>): Promise<Discount> => {
    const { data } = await api.post<Discount>("/discounts", discountData);
    return data;
  },

  updateDiscount: async (id: string, discountData: Partial<Discount>): Promise<Discount> => {
    const { data } = await api.patch<Discount>(`/discounts/${id}`, discountData);
    return data;
  },

  deleteDiscount: async (id: string): Promise<void> => {
    await api.delete(`/discounts/${id}`);
  },

  validateDiscount: async (code: string): Promise<unknown> => {
    const { data } = await api.post<unknown>("/discounts/validate", { code });
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
