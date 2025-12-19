import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import Button from '../common/Button';
import locationService from '../../services/locationService';

const ShippingForm = ({ shippingInfo, onInputChange, onSelectAddressClick, isGuest = false }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    if (shippingInfo.cityCode) {
      loadDistricts(shippingInfo.cityCode);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [shippingInfo.cityCode]);

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
      const data = await locationService.getDistrictsByProvince(provinceCode);
      setDistricts(data || []);
    } catch (error) {}
  };

  const loadWards = async (districtCode) => {
    try {
      const data = await locationService.getWardsByDistrict(districtCode);
      setWards(data || []);
    } catch (error) {}
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find(p => p.id === e.target.value);
    if (selectedProvince) {
      onInputChange('cityCode', selectedProvince.id);
      onInputChange('city', selectedProvince.name);
      onInputChange('districtCode', '');
      onInputChange('district', '');
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find(d => d.id === e.target.value);
    if (selectedDistrict) {
      onInputChange('districtCode', selectedDistrict.id);
      onInputChange('district', selectedDistrict.name);
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    }
  };

  const handleWardChange = (e) => {
    const selectedWard = wards.find(w => w.id === e.target.value);
    if (selectedWard) {
      onInputChange('wardCode', selectedWard.id);
      onInputChange('ward', selectedWard.name);
    }
  };

  const handleTextInputChange = (field, value) => {
    // Khi người dùng nhập tay, xóa code tương ứng để tránh inconsistency
    onInputChange(field, value);
    if (field === 'city') {
      onInputChange('cityCode', '');
      onInputChange('districtCode', '');
      onInputChange('district', '');
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    } else if (field === 'district') {
      onInputChange('districtCode', '');
      onInputChange('wardCode', '');
      onInputChange('ward', '');
    } else if (field === 'ward') {
      onInputChange('wardCode', '');
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-gray-900 flex items-center justify-center">
            <FaMapMarkerAlt className="text-gray-900 text-sm" />
          </div>
          <h2 className="text-lg font-normal text-gray-900">Thông Tin Giao Hàng</h2>
        </div>
        {!isGuest && (
          <button
            onClick={onSelectAddressClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-900 text-sm transition-colors"
          >
            <FaAddressBook size={14} />
            Chọn địa chỉ
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Họ và tên <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              value={shippingInfo.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Số điện thoại <span className="text-gray-400">*</span>
            </label>
            <input
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              placeholder="0123456789"
              maxLength={10}
            />
          </div>
        </div>

        {isGuest && (
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Email <span className="text-gray-400">*</span>
            </label>
            <input
              type="email"
              value={shippingInfo.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              placeholder="example@email.com"
            />
            <p className="text-xs text-gray-500 mt-2">Email để nhận thông tin đơn hàng</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Địa chỉ <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="Số nhà, tên đường"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Tỉnh/Thành phố <span className="text-gray-400">*</span>
            </label>
            {shippingInfo.city && !shippingInfo.cityCode ? (
              <input
                type="text"
                value={shippingInfo.city}
                onChange={(e) => handleTextInputChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Tỉnh/Thành phố"
              />
            ) : (
              <select
                value={shippingInfo.cityCode || ''}
                onChange={handleProvinceChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Quận/Huyện <span className="text-gray-400">*</span>
            </label>
            {shippingInfo.district && !shippingInfo.districtCode ? (
              <input
                type="text"
                value={shippingInfo.district}
                onChange={(e) => handleTextInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Quận/Huyện"
              />
            ) : (
              <select
                value={shippingInfo.districtCode || ''}
                onChange={handleDistrictChange}
                disabled={!shippingInfo.cityCode || districts.length === 0}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(district => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Phường/Xã <span className="text-gray-400">*</span>
            </label>
            {shippingInfo.ward && !shippingInfo.wardCode ? (
              <input
                type="text"
                value={shippingInfo.ward}
                onChange={(e) => handleTextInputChange('ward', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Phường/Xã"
              />
            ) : (
              <select
                value={shippingInfo.wardCode || ''}
                onChange={handleWardChange}
                disabled={!shippingInfo.districtCode || wards.length === 0}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Chọn phường/xã</option>
                {wards.map(ward => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={shippingInfo.note}
            onChange={(e) => onInputChange('note', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
            placeholder="Ghi chú cho người bán..."
          />
        </div>
      </div>
    </div>
  );
};
export default ShippingForm;