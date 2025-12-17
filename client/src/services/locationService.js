import axios from 'axios';
import { LOCATION_API, LOCATION_ENDPOINTS } from '../config/apiConstants';

/**
 * Location API Service - Wrapper cho external location API
 * Tương tự apiService nhưng dành cho external API
 */
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
  /**
   * Lấy danh sách tất cả tỉnh/thành phố
   * @returns {Promise} Danh sách tỉnh/thành phố
   */
  getAllProvinces: async () => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.ALL_PROVINCES);
    // esgoo API trả về {error, error_text, data_name, data: [...]}
    return response.data || [];
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   * @param {string} provinceId - Mã tỉnh/thành phố
   * @returns {Promise} Danh sách quận/huyện
   */
  getDistrictsByProvince: async (provinceId) => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.DISTRICTS_BY_PROVINCE(provinceId));
    // esgoo API trả về {error, error_text, data_name, data: [...]}
    return response.data || [];
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * @param {string} districtId - Mã quận/huyện
   * @returns {Promise} Danh sách phường/xã
   */
  getWardsByDistrict: async (districtId) => {
    const response = await locationApi.get(LOCATION_ENDPOINTS.WARDS_BY_DISTRICT(districtId));
    // esgoo API trả về {error, error_text, data_name, data: [...]}
    return response.data || [];
  },

  /**
   * Format địa chỉ đầy đủ
   * @param {Object} address - Object chứa thông tin địa chỉ
   * @returns {string} Địa chỉ đầy đủ
   */
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
