import apiService from "./apiService";

const ghnService = {
  getProvinces: async () => {
    return apiService.get("/ghn/provinces");
  },

  getDistricts: async (provinceId) => {
    return apiService.get(`/ghn/districts/${provinceId}`);
  },

  getWards: async (districtId) => {
    return apiService.get(`/ghn/wards/${districtId}`);
  },

  calculateFee: async (data) => {
    return apiService.post("/ghn/calculate-fee", data);
  },
  
  getOrderDetail: async (orderCode) => {
    return apiService.get(`/ghn/order-detail/${orderCode}`);
  }
};

export default ghnService;
