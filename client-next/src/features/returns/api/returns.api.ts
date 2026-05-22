import { api } from "@/lib/http";
import type {
  ConfirmGuestReturnSentPayload,
  CreateGuestReturnRequestPayload,
  CreateReturnRequestPayload,
  ReturnsQueryParams,
  UpdateReturnStatusPayload,
} from "@/features/returns/types";

export const returnsApi = {
  createReturnRequest: async (payload: CreateReturnRequestPayload) => {
    const { data } = await api.post("/returns", payload);
    return data;
  },

  createGuestReturnRequest: async (payload: CreateGuestReturnRequestPayload) => {
    const { data } = await api.post("/returns/guest", payload);
    return data;
  },

  confirmGuestSent: async (
    id: number,
    payload: ConfirmGuestReturnSentPayload
  ) => {
    const { data } = await api.post(
      `/returns/guest/${id}/confirm-sent`,
      payload
    );
    return data;
  },

  confirmSent: async (id: number) => {
    const { data } = await api.post(`/returns/my-returns/${id}/confirm-sent`);
    return data;
  },

  getMyReturns: async () => {
    const { data } = await api.get("/returns/my-returns");
    return data;
  },

  getReturnDetail: async (id: number) => {
    const { data } = await api.get(`/returns/${id}`);
    return data;
  },

  getAllReturns: async (params: ReturnsQueryParams = {}) => {
    const { data } = await api.get("/returns", { params });
    return data;
  },

  updateReturnStatus: async ({
    id,
    status,
    adminNote,
  }: UpdateReturnStatusPayload) => {
    const { data } = await api.patch(`/returns/${id}/status`, {
      status,
      adminNote,
    });
    return data;
  },
};
