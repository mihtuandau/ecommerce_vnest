import axios from 'axios';

// API miễn phí tỉnh/thành phố Việt Nam
const BASE_URL = 'https://provinces.open-api.vn/api';

const locationService = {
  /**
   * Lấy danh sách tất cả tỉnh/thành phố
   * @returns {Promise} Danh sách tỉnh/thành phố
   */
  getAllProvinces: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/p/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết tỉnh/thành phố (bao gồm quận/huyện)
   * @param {number} provinceCode - Mã tỉnh/thành phố
   * @returns {Promise} Thông tin tỉnh và danh sách quận/huyện
   */
  getProvinceWithDistricts: async (provinceCode) => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
      return response.data;
    } catch (error) {
      console.error('Error fetching province with districts:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết quận/huyện (bao gồm phường/xã)
   * @param {number} districtCode - Mã quận/huyện
   * @returns {Promise} Thông tin quận/huyện và danh sách phường/xã
   */
  getDistrictWithWards: async (districtCode) => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
      return response.data;
    } catch (error) {
      console.error('Error fetching district with wards:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   * @param {number} provinceCode - Mã tỉnh/thành phố
   * @returns {Promise} Danh sách quận/huyện
   */
  getDistrictsByProvince: async (provinceCode) => {
    try {
      const provinceData = await locationService.getProvinceWithDistricts(provinceCode);
      return provinceData.districts || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * @param {number} districtCode - Mã quận/huyện
   * @returns {Promise} Danh sách phường/xã
   */
  getWardsByDistrict: async (districtCode) => {
    try {
      const districtData = await locationService.getDistrictWithWards(districtCode);
      return districtData.wards || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
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
