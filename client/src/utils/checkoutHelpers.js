import { notify } from './notification';

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateCheckoutForm = (shippingInfo, isGuest, agreedToTerms) => {
  const {
    fullName = "",
    email = "",
    phone = "",
    address = "",
    city = "",
  } = shippingInfo || {};

  if (!fullName.trim()) {
    notify.error("Vui lòng nhập họ tên");
    return false;
  }

  if (isGuest && !email.trim()) {
    notify.error("Vui lòng nhập email để nhận thông tin đơn hàng");
    return false;
  }

  if (isGuest && email.trim() && !validateEmail(email)) {
    notify.error("Email không hợp lệ");
    return false;
  }

  if (!phone.trim() || !validatePhone(phone)) {
    notify.error("Số điện thoại không hợp lệ (10 chữ số)");
    return false;
  }

  if (!address.trim()) {
    notify.error("Vui lòng nhập địa chỉ");
    return false;
  }

  if (!city.trim()) {
    notify.error("Vui lòng chọn tỉnh/thành phố");
    return false;
  }

  if (!agreedToTerms) {
    notify.error("Vui lòng đồng ý điều khoản dịch vụ");
    return false;
  }

  return true;
};

export const formatShippingAddress = (shippingInfo) => {
  const parts = [
    shippingInfo.address,
    shippingInfo.ward,
    shippingInfo.district,
    shippingInfo.city
  ].filter(part => part?.trim());
  
  return parts.join(", ");
};

export const buildOrderData = (cartItems, shippingInfo, paymentMethod, isGuest, appliedDiscount = null, shippingFee = 0) => {
  console.log('🔨 buildOrderData called with:', {
    cartItemsCount: cartItems?.length,
    paymentMethod,
    isGuest,
    shippingFee,
    appliedDiscount
  });

  if (!cartItems || cartItems.length === 0) {
    console.error('❌ No cart items!', cartItems);
    throw new Error('Giỏ hàng trống');
  }

  if (!shippingInfo) {
    console.error('❌ No shipping info!');
    throw new Error('Thiếu thông tin giao hàng');
  }

  const orderData = {
    items: cartItems.map((item) => {
      console.log('📦 Processing item:', { variantId: item.variantId, quantity: item.quantity });
      return {
        variantId: item.variantId,
        quantity: item.quantity,
      };
    }),
    shippingAddress: formatShippingAddress(shippingInfo),
    shippingInfo: {
      fullName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      note: shippingInfo.note || "",
    },
    paymentMethod,
    shippingFee,
  };

  // Add discount code if applied
  if (appliedDiscount?.code) {
    orderData.discountCode = appliedDiscount.code;
    console.log('✅ Discount applied to order:', appliedDiscount.code);
  } else {
    console.log('⚠️ No discount applied:', appliedDiscount);
  }

  if (isGuest) {
    orderData.guestEmail = shippingInfo.email;
    orderData.guestPhone = shippingInfo.phone;
    console.log('👤 Guest order:', { email: orderData.guestEmail, phone: orderData.guestPhone });
  } else {
    console.log('👥 Authenticated user order');
  }

  console.log('📦 Final order data:', JSON.stringify(orderData, null, 2));
  return orderData;
};

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
export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};
