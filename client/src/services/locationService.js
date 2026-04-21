import apiService from './apiService';

const locationService = {
  
  getAllProvinces: async () => {
    try {
      const response = await apiService.get('/ghn/provinces');
      // GHN response might be { data: [...] } or the array itself if interceptor stripped it
      const provinces = response.data || (Array.isArray(response) ? response : []);
      console.log('Processed provinces:', provinces.length);
      return provinces.map(p => ({
        id: p.ProvinceID.toString(),
        name: p.ProvinceName
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách Tỉnh/Thành từ GHN:', error);
      return [];
    }
  },

  
  getDistrictsByProvince: async (provinceId) => {
    if (!provinceId) return [];
    try {
      const response = await apiService.get(`/ghn/districts/${provinceId}`);
      const districts = response.data || (Array.isArray(response) ? response : []);
      console.log(`Processed districts for ${provinceId}:`, districts.length);
      return districts.map(d => ({
        id: d.DistrictID.toString(),
        name: d.DistrictName
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách Quận/Huyện từ GHN:', error);
      return [];
    }
  },

  
  getWardsByDistrict: async (districtId) => {
    if (!districtId) return [];
    try {
      const response = await apiService.get(`/ghn/wards/${districtId}`);
      const wards = response.data || (Array.isArray(response) ? response : []);
      console.log(`Processed wards for ${districtId}:`, wards.length);
      return wards.map(w => ({
        id: w.WardCode,
        name: w.WardName
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách Phường/Xã từ GHN:', error);
      return [];
    }
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






