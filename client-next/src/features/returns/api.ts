import { api } from "@/lib/axios";

export const returnsApi = {
  createReturnRequest: async (data: any) => {
    const { data: response } = await api.post("/returns", data);
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
  getAllReturns: async (params: any) => {
    const { data: response } = await api.get("/returns", { params });
    return response;
  },

  updateReturnStatus: async (id: number, data: any) => {
    const { data: response } = await api.patch(`/returns/${id}/status`, data);
    return response;
  },
};
