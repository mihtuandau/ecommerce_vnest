import { api } from "@/lib/http";
import type { CalculateShippingFeePayload } from "@/features/shipping/types";

export const shippingApi = {
  getProvinces: async () => {
    const { data } = await api.get("/ghn/provinces");
    return data;
  },

  getDistricts: async (provinceId: number) => {
    const { data } = await api.get(`/ghn/districts/${provinceId}`);
    return data;
  },

  getWards: async (districtId: number) => {
    const { data } = await api.get(`/ghn/wards/${districtId}`);
    return data;
  },

  calculateFee: async (payload: CalculateShippingFeePayload) => {
    const { data } = await api.post("/ghn/calculate-fee", payload);
    return data;
  },
};
