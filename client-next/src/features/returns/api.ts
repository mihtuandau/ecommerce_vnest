import { api } from "@/lib/axios";

export const returnsApi = {
  createReturnRequest: async (data: {
    orderId: number;
    reason: string;
    items?: Record<string, unknown>[];
    details?: string;
    images?: string[];
  }) => {
    const { data: response } = await api.post("/returns", data);
    return response;
  },

  createGuestReturnRequest: async (data: {
    orderCode: string;
    contact: string;
    reason: string;
    items?: Record<string, unknown>[];
    details?: string;
    images?: string[];
  }) => {
    const { data: response } = await api.post("/returns/guest", data);
    return response;
  },

  confirmGuestSent: async (
    id: number,
    data: { orderCode: string; contact: string }
  ) => {
    const { data: response } = await api.post(
      `/returns/guest/${id}/confirm-sent`,
      data
    );
    return response;
  },

  confirmSent: async (id: number) => {
    const { data: response } = await api.post(
      `/returns/my-returns/${id}/confirm-sent`
    );
    return response;
  },

  getMyReturns: async () => {
    const { data: response } = await api.get("/returns/my-returns");
    return response;
  },

  getReturnDetail: async (id: number) => {
    const { data: response } = await api.get(`/returns/${id}`);
    return response;
  },

  // Admin endpoints
  getAllReturns: async (params: Record<string, string | number | undefined>) => {
    const { data: response } = await api.get("/returns", { params });
    return response;
  },

  updateReturnStatus: async (
    id: number,
    data: { status: string; adminNote?: string }
  ) => {
    const { data: response } = await api.patch(`/returns/${id}/status`, data);
    return response;
  },
};
