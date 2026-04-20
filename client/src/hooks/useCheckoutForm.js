import { useState } from 'react';

export const useCheckoutForm = (initialShippingInfo = null) => {
  const [shippingInfo, setShippingInfo] = useState(
    initialShippingInfo || {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      cityCode: "",
      district: "",
      districtCode: "",
      ward: "",
      wardCode: "",
      note: "",
    }
  );

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAddress = (addressData, currentEmail = "") => {
    setShippingInfo({
      fullName: addressData.fullName || "",
      email: currentEmail || shippingInfo.email, 
      phone: addressData.phone || "",
      address: addressData.street || "",
      city: addressData.city || "",
      cityCode: addressData.cityCode || "",
      district: addressData.state || "",
      districtCode: addressData.districtCode || "",
      ward: addressData.ward || "",
      wardCode: addressData.wardCode || "",
      note: shippingInfo.note || "",
    });
  };

  const resetForm = () => {
    setShippingInfo({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      cityCode: "",
      district: "",
      districtCode: "",
      ward: "",
      wardCode: "",
      note: "",
    });
    setPaymentMethod("CASH");
    setAgreedToTerms(false);
  };

  return {
    shippingInfo,
    setShippingInfo,
    paymentMethod,
    setPaymentMethod,
    agreedToTerms,
    setAgreedToTerms,
    handleInputChange,
    handleSelectAddress,
    resetForm,
  };
};






