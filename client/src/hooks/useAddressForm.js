import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import locationService from '../services/locationService';

export const useAddressForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    ward: '',
    zipCode: '',
    isDefault: false,
    addressType: 'home'
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.city) {
        const province = provinces.find(p => p.name === initialData.city);
        if (province) loadDistricts(province.code);
      }
      if (initialData.state) {
        const district = districts.find(d => d.name === initialData.state);
        if (district) loadWards(district.code);
      }
    }
  }, [initialData, provinces, districts]);

  const loadProvinces = async () => {
    try {
      setLoadingLocations(true);
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      setLoadingLocations(true);
      const data = await locationService.getDistrictsByProvince(provinceCode);
      setDistricts(data);
      setWards([]);
    } catch (error) {
      toast.error('Không thể tải danh sách quận/huyện');
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadWards = async (districtCode) => {
    try {
      setLoadingLocations(true);
      const data = await locationService.getWardsByDistrict(districtCode);
      setWards(data);
    } catch (error) {
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const selectedProvince = provinces.find(p => p.name === provinceName);
    
    setFormData({ ...formData, city: provinceName, state: '', ward: '' });
    setDistricts([]);
    setWards([]);
    
    if (selectedProvince) {
      loadDistricts(selectedProvince.code);
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const selectedDistrict = districts.find(d => d.name === districtName);
    
    setFormData({ ...formData, state: districtName, ward: '' });
    setWards([]);
    
    if (selectedDistrict) {
      loadWards(selectedDistrict.code);
    }
  };

  const handleWardChange = (e) => {
    setFormData({ ...formData, ward: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || 
        !formData.city.trim() || !formData.state.trim() || !formData.ward.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      ward: '',
      zipCode: '',
      isDefault: false,
      addressType: 'home'
    });
    setDistricts([]);
    setWards([]);
  };

  return {
    formData,
    provinces,
    districts,
    wards,
    loadingLocations,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleInputChange,
    validateForm,
    resetForm,
    setFormData
  };
};
