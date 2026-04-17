import axios from 'axios';
import { LOCATION_API, LOCATION_ENDPOINTS } from '../config/apiConstants';


const createLocationApiService = () => {
  const instance = axios.create({
    baseURL: LOCATION_API.BASE_URL,
    timeout: 10000,
  });

  return {
    get: async (url) => {
      try {
        const response = await instance.get(url);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  };
};

const locationApi = createLocationApiService();

const locationService = {
  
  getAllProvinces: async () => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.ALL_PROVINCES);
    return response.data || [];
  },

  
  getDistrictsByProvince: async (provinceId) => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.DISTRICTS_BY_PROVINCE(provinceId));
    return response.data || [];
  },

  
  getWardsByDistrict: async (districtId) => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.WARDS_BY_DISTRICT(districtId));
    return response.data || [];
  },

  
  formatFullAddress: (address) => {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    return parts.join(', ');
  }
};

export default locationService;






