import { api } from "@/lib/axios";

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
  calculateFee: async (payload: {
    to_district_id: number;
    to_ward_code: string;
    weight: number;
  }) => {
    const { data } = await api.post("/ghn/calculate-fee", payload);
    return data;
  },
};
