import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../utils/notification';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import {
  validateCheckoutForm,
  validateCheckoutStockAvailability,
  buildOrderData,
  saveGuestOrder,
  clearGuestCart,
} from '../utils/checkoutHelpers';

export const useCheckoutSubmit = (user) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const submitTimeoutRef = useRef(null); // Prevent multiple submissions within 2 seconds

  const handleSubmitOrder = useCallback(async (
    cartItems,
    shippingInfo,
    paymentMethod,
    agreedToTerms,
    appliedDiscount = null,
    shipping = 0
  ) => {
    // Prevent multiple rapid submissions
    if (submitting) {
      return false;
    }

    if (submitTimeoutRef.current) {
      notify.warning('Vui lòng chờ một chút trước khi thử lại');
      return false;
    }

    const isGuest = !user;

    if (!validateCheckoutForm(shippingInfo, isGuest, agreedToTerms)) {
      return false;
    }

    try {
      setSubmitting(true);
      submitTimeoutRef.current = setTimeout(() => {
        submitTimeoutRef.current = null;
      }, 2000); // 2 second cooldown between submissions

      // Validate stock availability before creating order
      const stockValidation = await validateCheckoutStockAvailability(cartItems);
      if (!stockValidation.valid) {
        return false;
      }

      const orderData = buildOrderData(
        cartItems,
        shippingInfo,
        paymentMethod,
        isGuest,
        appliedDiscount,
        shipping
      );

      // Create order first
      let orderId, orderCode;
      try {
        const response = isGuest
          ? await orderService.createGuestOrder(orderData)
          : await orderService.createOrder(orderData);

        orderId = response?.id;
        orderCode = response?.orderCode;
        
        if (!orderId || !orderCode) {
          notify.error('Lỗi: Không nhận được mã đơn hàng từ server');
          return false;
        }
      } catch (orderError) {
        // Order creation failed
        notify.error(orderError.response?.data?.message || 'Tạo đơn hàng thất bại. Vui lòng thử lại.');
        return false;
      }

      // Handle payment for online methods
      const onlineMethods = ['VNPAY', 'PAYOS'];
      if (onlineMethods.includes(paymentMethod)) {
        try {
          const paymentResponse = await paymentService.createPayment(orderId, paymentMethod);
          
          if (paymentResponse?.paymentLink) {
            if (isGuest) {
              saveGuestOrder(orderCode, shippingInfo.email);
              clearGuestCart();
            }
            
            notify.success('Đang chuyển đến trang thanh toán...', { duration: 2000 });
            setTimeout(() => {
              window.location.href = paymentResponse.paymentLink;
            }, 1000);
            
            return true;
          } else {
            // Payment creation failed but order exists
            notify.warning(
              `Đơn hàng ${orderCode} đã được tạo nhưng không thể khởi tạo thanh toán. Đang chuyển hướng...`,
              { duration: 3000 }
            );
            
            // Redirect to order detail where user can retry payment
            setTimeout(() => {
              if (isGuest) {
                saveGuestOrder(orderCode, shippingInfo.email);
                clearGuestCart();
                navigate(`/guest-order/${orderCode}`);
              } else {
                navigate(`/orders/${orderId}`);
              }
            }, 3000);
            
            return true; // Order created, user can retry payment later
          }
        } catch (paymentError) {
          // Payment creation failed but order exists - this is important!
          const errorMsg = paymentError.response?.data?.message || 'Không thể khởi tạo thanh toán';
          
          notify.error(
            `Đơn hàng ${orderCode} đã được tạo nhưng có lỗi thanh toán: ${errorMsg}. Vui lòng kiểm tra email để thanh toán lại.`,
            { duration: 5000 }
          );
          
          // Still redirect to order detail so user can retry
          setTimeout(() => {
            if (isGuest) {
              saveGuestOrder(orderCode, shippingInfo.email);
              clearGuestCart();
              navigate(`/guest-order/${orderCode}`);
            } else {
              navigate(`/orders/${orderId}`);
            }
          }, 2000);
          
          return true; // Order was created successfully
        }
      }

      // COD or other non-online payment methods
      if (isGuest) {
        clearGuestCart();
        saveGuestOrder(orderCode, shippingInfo.email);

        notify.success(
          `Đặt hàng thành công! Mã đơn hàng: ${orderCode}`,
          { duration: 5000 }
        );

        setTimeout(() => {
          navigate(`/guest-order/${orderCode}`);
        }, 1000);
      } else {
        notify.success("Đặt hàng thành công!");
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 1000);
      }

      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [submitting, user, navigate]);

  return {
    submitting,
    handleSubmitOrder,
  };
};






