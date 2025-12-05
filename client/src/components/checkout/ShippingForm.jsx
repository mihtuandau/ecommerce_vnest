import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import Button from '../common/Button';

const ShippingForm = ({ shippingInfo, onInputChange, onSelectAddressClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaMapMarkerAlt className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
        </div>
        <Button
          onClick={onSelectAddressClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FaAddressBook />
          Chọn địa chỉ đã lưu
        </Button>
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
              value={shippingInfo.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Hải Phòng">Hải Phòng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện
            </label>
            <input
              type="text"
              value={shippingInfo.district}
              onChange={(e) => onInputChange('district', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Quận/Huyện"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã
            </label>
            <input
              type="text"
              value={shippingInfo.ward}
              onChange={(e) => onInputChange('ward', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Phường/Xã"
            />
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