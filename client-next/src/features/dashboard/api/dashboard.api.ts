import { api } from "@/lib/http";
import type {
  DashboardPendingReview,
  DashboardRevenuePoint,
  DashboardStatsSummary,
  DashboardTopProduct,
} from "@/features/dashboard/types";
import type { Order } from "@/types/models";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsSummary> => {
    const { data } = await api.get<DashboardStatsSummary>("/dashboard/stats");
    return data;
  },
  getRevenue: async (
    params?: Record<string, any>
  ): Promise<DashboardRevenuePoint[]> => {
    const { data } = await api.get<DashboardRevenuePoint[]>("/dashboard/revenue", {
      params,
    });
    return data;
  },
  getRecentOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>("/dashboard/recent-orders");
    return data;
  },
  getTopProducts: async (): Promise<DashboardTopProduct[]> => {
    const { data } = await api.get<DashboardTopProduct[]>("/dashboard/top-products");
    return data;
  },
  getPendingReviews: async (): Promise<DashboardPendingReview[]> => {
    const { data } =
      await api.get<DashboardPendingReview[]>("/dashboard/pending-reviews");
    return data;
  },
};
