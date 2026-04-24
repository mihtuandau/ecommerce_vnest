import { api } from "@/lib/axios";

export const reportsApi = {
  getSummary: async (params?: Record<string, any>) => {
    const { data } = await api.get("/reports/summary", { params });
    return data;
  },
  getRevenue: async (params?: Record<string, any>) => {
    const { data } = await api.get("/reports/revenue", { params });
    return data;
  },
  getTopProducts: async (params?: Record<string, any>) => {
    const { data } = await api.get("/reports/top-products", { params });
    return data;
  },
  exportReport: async (params?: Record<string, any>) => {
    const { data } = await api.get("/reports/export", {
      params,
      responseType: "blob",
    });
    return data;
  },
};
