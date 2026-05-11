import { api } from "@/lib/axios";

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },
  getRevenue: async (params?: Record<string, any>) => {
    const { data } = await api.get("/dashboard/revenue", { params });
    return data;
  },
  getRecentOrders: async () => {
    const { data } = await api.get("/dashboard/recent-orders");
    return data;
  },
  getTopProducts: async () => {
    const { data } = await api.get("/dashboard/top-products");
    return data;
  },
  getPendingReviews: async () => {
    const { data } = await api.get("/dashboard/pending-reviews");
    return data;
  },
};
