import { api } from "@/lib/axios";
import type { Order } from "@/types/models";
import { OrderStatus, PaymentStatus } from "@/types/enums";

export const ordersApi = {
  createOrder: async (
    orderData: Partial<Order> & {
      shippingInfo?: any;
      guestEmail?: string;
      guestPhone?: string;
    },
    isGuest = false
  ): Promise<any> => {
    const endpoint = isGuest ? "/orders/guest" : "/orders";
    const { data } = await api.post(endpoint, orderData);
    return data;
  },

  createAdminOrder: async (orderData: Partial<Order>): Promise<any> => {
    const { data } = await api.post("/orders/admin", orderData);
    return data;
  },

  getOrders: async (params?: Record<string, string | number>): Promise<Order[]> => {
    // Dùng cho Admin - xem tất cả đơn hàng
    const { data: body } = await api.get<any>("/orders", { params });
    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;
    if (body?.orders && Array.isArray(body.orders)) return body.orders;
    return [];
  },

  getMyOrders: async (params?: Record<string, string | number>): Promise<Order[]> => {
    // Dùng cho Khách hàng - chỉ xem đơn hàng cá nhân
    const { data: body } = await api.get<any>("/orders/my-orders", { params });
    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;
    if (body?.orders && Array.isArray(body.orders)) return body.orders;
    return [];
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data: body } = await api.get<any>(`/orders/${id}`);
    return body?.data || body;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    // Backend uses PUT /orders/:id for status updates
    const { data } = await api.put<Order>(`/orders/${id}`, { status });
    return data;
  },

  cancelOrder: async (id: string): Promise<void> => {
    await api.put(`/orders/${id}/cancel`);
  },

  cancelGuestOrder: async (orderCode: string, contact: string): Promise<any> => {
    const { data } = await api.put(
      `/orders/guest/${orderCode}/cancel`,
      {},
      {
        params: { contact },
      }
    );
    return data;
  },

  syncToGHN: async (id: string) => {
    const { data } = await api.post(`/orders/${id}/ghn`);
    return data;
  },

  updatePaymentStatus: async (paymentId: string, status: PaymentStatus) => {
    const { data } = await api.put(`/payments/${paymentId}/status`, { status });
    return data;
  },

  lookupGuestOrder: async (orderCode: string, contact: string): Promise<Order> => {
    const { data: body } = await api.get<any>(`/orders/guest/lookup/${orderCode}`, {
      params: { contact },
    });
    return body?.data || body;
  },

  getStats: async () => {
    const { data } = await api.get("/orders", { params: { limit: 1000 } });
    return data;
  },
};
