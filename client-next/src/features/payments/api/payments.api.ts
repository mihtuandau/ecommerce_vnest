import { api } from "@/lib/http";
import type {
  CreatePaymentPayload,
  PaymentsQueryParams,
  UpdatePaymentStatusPayload,
} from "@/features/payments/types";

export const paymentsApi = {
  createPayment: async ({ orderId, method }: CreatePaymentPayload) => {
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

  getPayments: async (params?: PaymentsQueryParams) => {
    const { data } = await api.get("/payments", { params });
    return data;
  },

  updatePaymentStatus: async ({ id, status }: UpdatePaymentStatusPayload) => {
    const { data } = await api.put(`/payments/${id}/status`, { status });
    return data;
  },
};
