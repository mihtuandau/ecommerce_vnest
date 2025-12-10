import toast from 'react-hot-toast';

/**
 * Validate email format with comprehensive regex
 */
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

/**
 * Validate checkout form
 */
export const validateCheckoutForm = (shippingInfo, isGuest, agreedToTerms) => {
  const {
    fullName = "",
    email = "",
    phone = "",
    address = "",
    city = "",
  } = shippingInfo || {};

  if (!fullName.trim()) {
    toast.error("Vui lòng nhập họ tên");
    return false;
  }

  if (isGuest && !email.trim()) {
    toast.error("Vui lòng nhập email để nhận thông tin đơn hàng");
    return false;
  }

  if (isGuest && email.trim() && !validateEmail(email)) {
    toast.error("Email không hợp lệ");
    return false;
  }

  if (!phone.trim() || !validatePhone(phone)) {
    toast.error("Số điện thoại không hợp lệ (10 chữ số)");
    return false;
  }

  if (!address.trim()) {
    toast.error("Vui lòng nhập địa chỉ");
    return false;
  }

  if (!city.trim()) {
    toast.error("Vui lòng chọn tỉnh/thành phố");
    return false;
  }

  if (!agreedToTerms) {
    toast.error("Vui lòng đồng ý điều khoản dịch vụ");
    return false;
  }

  return true;
};

/**
 * Format shipping address string
 */
export const formatShippingAddress = (shippingInfo) => {
  const parts = [
    shippingInfo.address,
    shippingInfo.ward,
    shippingInfo.district,
    shippingInfo.city
  ].filter(part => part?.trim());
  
  return parts.join(", ");
};

/**
 * Build order data object
 */
export const buildOrderData = (cartItems, shippingInfo, paymentMethod, isGuest) => {
  const orderData = {
    items: cartItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })),
    shippingAddress: formatShippingAddress(shippingInfo),
    shippingInfo: {
      fullName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      note: shippingInfo.note || "",
    },
    paymentMethod,
  };

  if (isGuest) {
    orderData.guestEmail = shippingInfo.email;
    orderData.guestPhone = shippingInfo.phone;
  }

  return orderData;
};

/**
 * Manage guest orders in localStorage
 */
export const saveGuestOrder = (orderCode, email) => {
  const guestOrders = JSON.parse(localStorage.getItem("guest_orders") || "[]");
  
  guestOrders.push({
    orderCode,
    contact: email,
    date: new Date().toISOString(),
  });

  // Keep only last 10 orders
  if (guestOrders.length > 10) {
    guestOrders.shift();
  }

  localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
};

/**
 * Clear guest cart from localStorage
 */
export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};
