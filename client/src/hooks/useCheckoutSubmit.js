import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../utils/notification';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import {
  validateCheckoutForm,
  buildOrderData,
  saveGuestOrder,
  clearGuestCart,
} from '../utils/checkoutHelpers';

/**
 * Custom hook for handling checkout submission logic
 */
export const useCheckoutSubmit = (user) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (
    cartItems,
    shippingInfo,
    paymentMethod,
    agreedToTerms,
    appliedDiscount = null,
    shipping = 0
  ) => {
    const isGuest = !user;

    // Ngăn chặn submit nếu đang xử lý
    if (submitting) {
      console.log('⚠️ Already submitting, ignoring duplicate request');
      return false;
    }

    console.log('🚀 Submit order with discount:', appliedDiscount);

    // Validate form
    if (!validateCheckoutForm(shippingInfo, isGuest, agreedToTerms)) {
      return false;
    }

    try {
      setSubmitting(true);

      // Build order data with discount and shipping
      const orderData = buildOrderData(
        cartItems,
        shippingInfo,
        paymentMethod,
        isGuest,
        appliedDiscount,
        shipping
      );

      console.log('📨 Sending order to API:', orderData);

      // Submit order
      const response = isGuest
        ? await orderService.createGuestOrder(orderData)
        : await orderService.createOrder(orderData);

      console.log('📦 Order response:', response);
      
      // apiService.post() returns response.data directly, so response is the order object
      const orderId = response?.id;
      const orderCode = response?.orderCode;
      
      if (!orderId || !orderCode) {
        console.error('❌ Missing orderId or orderCode in response:', response);
        notify.error('Lỗi: Không nhận được mã đơn hàng từ server');
        return false;
      }
      
      console.log('✅ Order created:', { orderId, orderCode });

      // Xử lý thanh toán PayOS
      if (paymentMethod === 'PAYOS') {
        try {
          console.log('💳 Creating PayOS payment for order:', orderId);
          const paymentResponse = await paymentService.createPayment(orderId, 'PAYOS');
          console.log('💳 PayOS Response:', paymentResponse);
          
          if (paymentResponse.paymentLink) {
            // Lưu thông tin đơn hàng trước khi redirect
            if (isGuest) {
              saveGuestOrder(orderCode, shippingInfo.email);
              clearGuestCart();
            }
            
            notify.success('Đang chuyển đến trang thanh toán...', { duration: 2000 });
            
            console.log('🔗 Redirecting to:', paymentResponse.paymentLink);
            
            // Redirect đến PayOS payment link
            setTimeout(() => {
              window.location.href = paymentResponse.paymentLink;
            }, 1000);
            
            return true;
          } else {
            console.error('❌ No payment link in response:', paymentResponse);
            notify.error('Không nhận được link thanh toán từ PayOS');
            return false;
          }
        } catch (error) {
          console.error('❌ PayOS Error:', error);
          notify.error(error.response?.data?.message || 'Không thể tạo link thanh toán. Vui lòng thử lại.');
          return false;
        }
      }

      // Handle guest checkout (COD)
      if (isGuest) {
        clearGuestCart();
        saveGuestOrder(orderCode, shippingInfo.email);

        notify.success(
          `Đặt hàng thành công! Mã đơn hàng: ${orderCode}`,
          { duration: 5000 }
        );

        // Redirect to guest order detail page
        setTimeout(() => {
          navigate(`/guest-order/${orderCode}`);
        }, 1000);
      } else {
        // Handle logged-in user checkout (COD)
        notify.success("Đặt hàng thành công!");
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 1000);
      }

      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || "Đặt hàng thất bại");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleSubmitOrder,
  };
};
