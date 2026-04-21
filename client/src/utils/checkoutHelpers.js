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
  

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  if (!shippingInfo) {
    throw new Error('Thiếu thông tin giao hàng');
  }

  const orderData = {
    items: cartItems.map((item, index) => {
      const variantId = parseInt(item.variantId || item.id, 10);
      const quantity = parseInt(item.quantity, 10);
      
      if (!Number.isInteger(variantId) || variantId <= 0) {
        throw new Error(`Sản phẩm #${index + 1} có dữ liệu không hợp lệ (variantId: ${item.variantId || item.id})`);
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(`Sản phẩm #${index + 1} có số lượng không hợp lệ (${item.quantity})`);
      }
      
      // Include expected price for backend validation
      const price = item.product?.variant?.price || item.price;
      
      return {
        variantId,
        quantity,
        price // Send frontend's expected price for backend price change detection
      };
    }),
    shippingAddress: formatShippingAddress(shippingInfo),
    shippingInfo: {
      fullName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      ward: shippingInfo.ward,
      wardCode: shippingInfo.wardCode,
      district: shippingInfo.district,
      districtCode: shippingInfo.districtCode,
      city: shippingInfo.city,
      cityCode: shippingInfo.cityCode,
      provinceCode: shippingInfo.cityCode, // Đồng bộ với backend
      note: shippingInfo.note || "",
    },
    paymentMethod,
    shippingFee,
  };

  if (appliedDiscount?.code) {
    orderData.discountCode = appliedDiscount.code;
  } else {
  }

  if (isGuest) {
    orderData.guestEmail = shippingInfo.email;
    orderData.guestPhone = shippingInfo.phone;
  } else {
  }

  return orderData;
};

export const saveGuestOrder = (orderCode, email) => {
  const guestOrders = JSON.parse(localStorage.getItem("guest_orders") || "[]");
  
  guestOrders.push({
    orderCode,
    contact: email,
    date: new Date().toISOString(),
  });

  if (guestOrders.length > 10) {
    guestOrders.shift();
  }

  localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
};
export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};

/**
 * Validate checkout items - check if stock is available before submitting order
 * This prevents checkout with items that are no longer in stock
 */
export const validateCheckoutStockAvailability = async (cartItems) => {
  try {
    const items = cartItems.map(item => ({
      variantId: parseInt(item.variantId || item.id, 10),
      quantity: parseInt(item.quantity, 10)
    }));

    // Import dynamically to avoid circular dependency
    const { default: apiService } = await import('../services/apiService');
    
    const response = await apiService.post('/cart/validate-checkout', { items });
    
    if (!response.valid) {
      // Some items are out of stock
      const outOfStockItems = response.items.filter(item => !item.canCheckout);
      
      if (outOfStockItems.length > 0) {
        const messages = outOfStockItems
          .map(item => `Sản phẩm #${item.variantId}: ${item.reason}`)
          .join('\n');
        
        notify.error(`Không đủ hàng tồn kho:\n${messages}`);
        
        // Return validation result with available stock info
        return {
          valid: false,
          items: response.items,
          message: response.message
        };
      }
    }
    
    return {
      valid: true,
      items: response.items,
      message: response.message
    };
  } catch (error) {
    console.error('Stock validation error:', error);
    // If validation fails, allow checkout but warn user
    notify.warning('Không thể kiểm tra hàng tồn kho. Vui lòng tiếp tục cẩn thận.');
    return { valid: true }; // Fallback to allow checkout
  }
};

