import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import Button from '../common/Button';
import locationService from '../../services/locationService';

const ShippingForm = ({ shippingInfo, onInputChange, onSelectAddressClick, isGuest = false }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load districts when province changes or when address is selected
  useEffect(() => {
    if (shippingInfo.cityCode) {
      loadDistricts(shippingInfo.cityCode);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [shippingInfo.cityCode]);

  // Load wards when district changes or when address is selected
  useEffect(() => {
    if (shippingInfo.districtCode) {
      loadWards(shippingInfo.districtCode);
    } else {
      setWards([]);
    }
  }, [shippingInfo.districtCode]);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      const data = await locationService.getProvinceWithDistricts(provinceCode);
      setDistricts(data.districts || []);
    } catch (error) {}
  };

  const loadWards = async (districtCode) => {
    try {
      const data = await locationService.getDistrictWithWards(districtCode);
      setWards(data.wards || []);
    } catch (error) {}
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find(p => p.code === parseInt(e.target.value));
    if (selectedProvince) {
      onInputChange('cityCode', selectedProvince.code);
      onInputChange('city', selectedProvince.name);
      onInputChange('districtCode', '');
      onInputChange('district', '');
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find(d => d.code === parseInt(e.target.value));
    if (selectedDistrict) {
      onInputChange('districtCode', selectedDistrict.code);
      onInputChange('district', selectedDistrict.name);
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    }
  };

  const handleWardChange = (e) => {
    const selectedWard = wards.find(w => w.code === parseInt(e.target.value));
    if (selectedWard) {
      onInputChange('wardCode', selectedWard.code);
      onInputChange('ward', selectedWard.name);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaMapMarkerAlt className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
        </div>
        {!isGuest && (
          <Button
            onClick={onSelectAddressClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FaAddressBook />
            Chọn địa chỉ đã lưu
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shippingInfo.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0123456789"
              maxLength={10}
            />
          </div>
        </div>

        {isGuest && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={shippingInfo.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">Email để nhận thông tin đơn hàng</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Số nhà, tên đường"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              value={shippingInfo.cityCode || ''}
              onChange={handleProvinceChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <select
              value={shippingInfo.districtCode || ''}
              onChange={handleDistrictChange}
              disabled={!shippingInfo.cityCode || districts.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map(district => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <select
              value={shippingInfo.wardCode || ''}
              onChange={handleWardChange}
              disabled={!shippingInfo.districtCode || wards.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Chọn phường/xã</option>
              {wards.map(ward => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={shippingInfo.note}
            onChange={(e) => onInputChange('note', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Ghi chú cho người bán..."
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;