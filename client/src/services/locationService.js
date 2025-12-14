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
    return await locationApi.get(LOCATION_ENDPOINTS.ALL_PROVINCES);
  },

  /**
   * Lấy thông tin chi tiết tỉnh/thành phố (bao gồm quận/huyện)
   * @param {number} provinceCode - Mã tỉnh/thành phố
   * @returns {Promise} Thông tin tỉnh và danh sách quận/huyện
   */
  getProvinceWithDistricts: async (provinceCode) => {
    return await locationApi.get(LOCATION_ENDPOINTS.PROVINCE_WITH_DISTRICTS(provinceCode));
  },

  /**
   * Lấy thông tin chi tiết quận/huyện (bao gồm phường/xã)
   * @param {number} districtCode - Mã quận/huyện
   * @returns {Promise} Thông tin quận/huyện và danh sách phường/xã
   */
  getDistrictWithWards: async (districtCode) => {
    return await locationApi.get(LOCATION_ENDPOINTS.DISTRICT_WITH_WARDS(districtCode));
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   * @param {number} provinceCode - Mã tỉnh/thành phố
   * @returns {Promise} Danh sách quận/huyện
   */
  getDistrictsByProvince: async (provinceCode) => {
    const provinceData = await locationService.getProvinceWithDistricts(provinceCode);
    return provinceData.districts || [];
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * @param {number} districtCode - Mã quận/huyện
   * @returns {Promise} Danh sách phường/xã
   */
  getWardsByDistrict: async (districtCode) => {
    const districtData = await locationService.getDistrictWithWards(districtCode);
    return districtData.wards || [];
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
