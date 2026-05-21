import { api } from "@/lib/http";
import type { ReportQueryParams } from "@/features/reports/types";

export const reportsApi = {
  getSummary: async (params?: ReportQueryParams) => {
    const { data } = await api.get("/reports/summary", { params });
    return data;
  },

  getRevenue: async (params?: ReportQueryParams) => {
    const { data } = await api.get("/reports/revenue", { params });
    return data;
  },

  getTopProducts: async (params?: ReportQueryParams) => {
    const { data } = await api.get("/reports/top-products", { params });
    return data;
  },

  exportReport: async (params?: ReportQueryParams) => {
    const { data } = await api.get("/reports/export", {
      params,
      responseType: "blob",
    });
    return data;
  },
};
