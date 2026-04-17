import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { notify } from "../../utils/notification";
import addressService from "../../services/addressService";
import locationService from "../../services/locationService";

const AddressSelector = ({ onAddressSelect, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddresses();
      const addressList =
        response.addresses || response.data?.addresses || response || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
    } catch (error) {
      console.error("Load addresses error:", error);
      notify.error("Không thể tải danh sách địa chỉ");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text) => {
    if (!text) return "";
    return text.toLowerCase().trim().replace(/\s+/g, " ");
  };

  const handleSelectAddress = async (address) => {
    try {
      const provinces = await locationService.getAllProvinces();
      const normalizedCity = normalizeText(address.city);
      const selectedProvince = provinces.find(
        (p) =>
          normalizeText(p.name) === normalizedCity ||
          normalizeText(p.name).includes(normalizedCity) ||
          normalizedCity.includes(normalizeText(p.name)),
      );

      if (!selectedProvince) {
        console.log("Province not found for:", address.city);
        onAddressSelect(address);
        return;
      }

      let districtCode = "";
      let wardCode = "";

      if (address.state) {
        const districts = await locationService.getDistrictsByProvince(
          selectedProvince.id,
        );
        const normalizedState = normalizeText(address.state);
        const selectedDistrict = districts?.find(
          (d) =>
            normalizeText(d.name) === normalizedState ||
            normalizeText(d.name).includes(normalizedState) ||
            normalizedState.includes(normalizeText(d.name)),
        );

        if (selectedDistrict) {
          districtCode = selectedDistrict.id;

          if (address.ward) {
            const wards =
              await locationService.getWardsByDistrict(districtCode);
            const normalizedWard = normalizeText(address.ward);
            const selectedWard = wards?.find(
              (w) =>
                normalizeText(w.name) === normalizedWard ||
                normalizeText(w.name).includes(normalizedWard) ||
                normalizedWard.includes(normalizeText(w.name)),
            );

            if (selectedWard) {
              wardCode = selectedWard.id;
            }
          }
        }
      }

      const addressWithCodes = {
        ...address,
        cityCode: selectedProvince.id,
        districtCode: districtCode,
        wardCode: wardCode,
      };

      onAddressSelect(addressWithCodes);
    } catch (error) {
      console.error("Error mapping address codes:", error);
      onAddressSelect(address);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-300">
        <FaMapMarkerAlt className="mx-auto text-gray-400 mb-4" size={40} />
        <p className="text-gray-600 mb-4">Chưa có địa chỉ nào được lưu</p>
        <a
          href="/profile"
          className="inline-block px-6 py-3 bg-black hover:bg-neutral-800 text-white transition-colors"
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
          className={`bg-white border p-4 cursor-pointer transition-colors ${
            selectedAddressId === address.id
              ? "border-gray-900 bg-gray-50"
              : address.isDefault
                ? "border-gray-400"
                : "border-gray-300"
          }`}
          onClick={() => handleSelectAddress(address)}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selectedAddressId === address.id
                  ? "border-black bg-black"
                  : "border-gray-400"
              }`}
            >
              {selectedAddressId === address.id && (
                <div className="w-2 h-2 bg-white"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-900" />
                <span className="font-normal text-gray-900">
                  {address.fullName}
                </span>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-xs">
                    <FaStar size={9} />
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
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
        className="block text-center py-3 text-sm text-gray-900 hover:text-gray-600 transition-colors"
      >
        + Thêm địa chỉ mới
      </a>
    </div>
  );
};

export default AddressSelector;
