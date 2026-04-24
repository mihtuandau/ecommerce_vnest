import { api } from "@/lib/axios";
import type { Order } from "@/types/models";

export const ordersApi = {
  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    const { data: body } = await api.get<any>("/orders", { params });
    // Handle various response structures from backend body
    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;
    if (body?.orders && Array.isArray(body.orders)) return body.orders;
    return [];
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data: body } = await api.get<any>(`/orders/${id}`);
    return body?.data || body;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    // Backend uses PUT /orders/:id for status updates
    const { data } = await api.put<Order>(`/orders/${id}`, { status });
    return data;
  },

  cancelOrder: async (id: string): Promise<void> => {
    await api.put(`/orders/${id}/cancel`);
  },

  syncToGHN: async (id: string) => {
    const { data } = await api.post(`/orders/${id}/ghn`);
    return data;
  },

  updatePaymentStatus: async (paymentId: string, status: string) => {
    const { data } = await api.put(`/payments/${paymentId}/status`, { status });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/orders", { params: { limit: 1000 } });
    return data;
  },
};
