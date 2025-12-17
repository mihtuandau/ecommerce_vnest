import { useState, useEffect } from 'react';
import { notify } from '../utils/notification';
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    if (initialData && provinces.length > 0 && !initialized) {
      setFormData(initialData);
      
      // Load districts if city is present
      if (initialData.city) {
        const province = provinces.find(p => p.name === initialData.city);
        if (province) {
          loadDistricts(province.id).then(() => {
            // After districts are loaded, load wards if state is present
            if (initialData.state) {
              // Wait a bit for districts to be set
              setTimeout(() => {
                const district = districts.find(d => d.name === initialData.state);
                if (district) loadWards(district.id);
              }, 100);
            }
          });
        }
      }
      
      setInitialized(true);
    }
  }, [initialData, provinces.length]);

  const loadProvinces = async () => {
    try {
      setLoadingLocations(true);
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      notify.error('Không thể tải danh sách tỉnh/thành phố');
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
      notify.error('Không thể tải danh sách quận/huyện');
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
      notify.error('Không thể tải danh sách phường/xã');
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
      loadDistricts(selectedProvince.id);
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const selectedDistrict = districts.find(d => d.name === districtName);
    
    setFormData({ ...formData, state: districtName, ward: '' });
    setWards([]);
    
    if (selectedDistrict) {
      loadWards(selectedDistrict.id);
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
      notify.error('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      notify.error('Số điện thoại không hợp lệ');
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
