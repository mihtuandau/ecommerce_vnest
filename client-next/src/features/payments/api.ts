import { api } from "@/lib/axios";

export const paymentsApi = {
  createPayment: async (orderId: number, method: string) => {
    const { data } = await api.post("/payments", {
      orderId,
      method,
    });
    return data;
  },

  getPayment: async (id: number) => {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },

  getPayments: async (params?: Record<string, any>) => {
    const { data } = await api.get("/payments", { params });
    return data;
  },

  updatePaymentStatus: async (id: number, status: string) => {
    const { data } = await api.put(`/payments/${id}/status`, { status });
    return data;
  },
};
