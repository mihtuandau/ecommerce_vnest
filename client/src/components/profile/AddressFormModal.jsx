import React from "react";
import { FaTimes } from "react-icons/fa";

const AddressFormModal = ({
  show,
  title,
  formData,
  provinces,
  districts,
  wards,
  loadingLocations,
  onClose,
  onSubmit,
  onInputChange,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 transition-opacity duration-400 ease-out"
    >
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex justify-between items-center">
          <h2 className="text-xl font-normal text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Họ tên <span className="text-gray-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Số điện thoại <span className="text-gray-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="0xxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-900 mb-2">
                Địa chỉ <span className="text-gray-400">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Số nhà, tên đường"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Tỉnh/Thành phố <span className="text-gray-400">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={onProvinceChange}
                  disabled={loadingLocations}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Quận/Huyện <span className="text-gray-400">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={onDistrictChange}
                  disabled={!formData.city || loadingLocations}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Phường/Xã <span className="text-gray-400">*</span>
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={onWardChange}
                  disabled={!formData.state || loadingLocations}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-900 mb-2">
                Mã bưu chính (tùy chọn)
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Nhập mã bưu chính"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={onInputChange}
                className="w-4 h-4 border-gray-300 text-gray-900"
              />
              <label
                htmlFor="isDefault"
                className="text-sm font-normal text-gray-900"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 hover:border-[#00a85a] text-gray-900 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#00a85a] hover:bg-[#008f4d] text-white transition-colors"
            >
              {title.includes("Thêm") ? "Thêm địa chỉ" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
