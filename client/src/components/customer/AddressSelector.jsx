import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import locationService from '../../services/locationService';

const AddressSelector = ({ userId, onAddressSelect, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await userService.getAddresses(userId);
      setAddresses(response.addresses || response.data?.addresses || []);
    } catch (error) {
      toast.error('Không thể tải danh sách địa chỉ');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (address) => {
    try {
      // Fetch location codes based on names
      const provinces = await locationService.getAllProvinces();
      const selectedProvince = provinces.find(p => p.name === address.city);
      
      if (!selectedProvince) {
        onAddressSelect(address);
        return;
      }

      let districtCode = '';
      let wardCode = '';

      // Get district code
      if (address.state) {
        const provinceWithDistricts = await locationService.getProvinceWithDistricts(selectedProvince.code);
        const selectedDistrict = provinceWithDistricts.districts?.find(d => d.name === address.state);
        if (selectedDistrict) {
          districtCode = selectedDistrict.code;

          // Get ward code
          if (address.ward) {
            const districtWithWards = await locationService.getDistrictWithWards(districtCode);
            const selectedWard = districtWithWards.wards?.find(w => w.name === address.ward);
            if (selectedWard) {
              wardCode = selectedWard.code;
            }
          }
        }
      }

      // Add codes to address object
      const addressWithCodes = {
        ...address,
        cityCode: selectedProvince.code,
        districtCode: districtCode,
        wardCode: wardCode
      };

      onAddressSelect(addressWithCodes);
    } catch (error) {
      // Fallback to original address without codes
      onAddressSelect(address);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
        <FaMapMarkerAlt className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-600 mb-4">Chưa có địa chỉ nào được lưu</p>
        <a
          href="/profile"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm địa chỉ trong trang cá nhân
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
            selectedAddressId === address.id
              ? 'border-blue-500 border-2 bg-blue-50'
              : address.isDefault
              ? 'border-blue-300 hover:border-blue-400'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleSelectAddress(address)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              selectedAddressId === address.id
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300'
            }`}>
              {selectedAddressId === address.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-900">{address.fullName}</span>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                    <FaStar size={10} />
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                📱 {address.phone}
              </p>
              <p className="text-sm text-gray-800">
                {address.street}
                {address.ward && `, ${address.ward}`}
                {address.state && `, ${address.state}`}
                {address.city && `, ${address.city}`}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <a
        href="/profile"
        className="block text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        + Thêm địa chỉ mới
      </a>
    </div>
  );
};

export default AddressSelector;
