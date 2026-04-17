import React from "react";
import { FaMapMarkerAlt, FaAddressBook } from "react-icons/fa";
import { useLocations } from "../../hooks/useLocations";

const ShippingForm = ({ shippingInfo, onInputChange, onSelectAddressClick, isGuest = false }) => {
  const { provinces, districts, wards, loading } = useLocations(shippingInfo.cityCode, shippingInfo.districtCode);

  const handleFieldChange = (field, item) => {
    if (!item) return;
    onInputChange(field + "Code", item.id);
    onInputChange(field, item.name);
    if (field === "city") { onInputChange("districtCode", ""); onInputChange("district", ""); onInputChange("wardCode", ""); onInputChange("ward", ""); }
    else if (field === "district") { onInputChange("wardCode", ""); onInputChange("ward", ""); }
  };

  const InputField = ({ label, field, placeholder, type = "text", ...rest }) => (
    <div>
      <label className="block text-sm font-normal text-gray-900 mb-2">{label} <span className="text-gray-400">*</span></label>
      <input type={type} value={shippingInfo[field] || ""} onChange={e => onInputChange(field, e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 outline-none" placeholder={placeholder} {...rest} />
    </div>
  );

  const SelectField = ({ label, field, options, disabled, placeholder }) => (
    <div>
      <label className="block text-sm font-normal text-gray-900 mb-2">{label} <span className="text-gray-400">*</span></label>
      <select value={shippingInfo[field + "Code"] || ""} onChange={e => handleFieldChange(field, options.find(o => o.id === e.target.value))} disabled={disabled || loading} className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 outline-none disabled:bg-gray-50">
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3"><div className="w-10 h-10 border border-black flex items-center justify-center"><FaMapMarkerAlt className="text-gray-900 text-sm" /></div><h2 className="text-lg font-normal text-gray-900">Thông Tin Giao Hàng</h2></div>
        {!isGuest && <button onClick={onSelectAddressClick} className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black text-sm transition-all"><FaAddressBook size={14} /> Chọn địa chỉ</button>}
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Họ và tên" field="fullName" placeholder="Nguyễn Văn A" />
          <InputField label="Số điện thoại" field="phone" placeholder="0123456789" maxLength={10} />
        </div>
        {isGuest && <InputField label="Email" field="email" placeholder="example@email.com" />}
        <InputField label="Địa chỉ" field="address" placeholder="Số nhà, tên đường" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SelectField label="Tỉnh/Thành phố" field="city" options={provinces} placeholder="Chọn tỉnh/thành phố" />
          <SelectField label="Quận/Huyện" field="district" options={districts} disabled={!shippingInfo.cityCode} placeholder="Chọn quận/huyện" />
          <SelectField label="Phường/Xã" field="ward" options={wards} disabled={!shippingInfo.districtCode} placeholder="Chọn phường/xã" />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">Ghi chú (tùy chọn)</label>
          <textarea value={shippingInfo.note} onChange={e => onInputChange("note", e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 outline-none resize-none" placeholder="Ghi chú cho người bán..." />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
