import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
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
    agreedToTerms
  ) => {
    const isGuest = !user;

    // Validate form
    if (!validateCheckoutForm(shippingInfo, isGuest, agreedToTerms)) {
      return false;
    }

    try {
      setSubmitting(true);

      // Build order data
      const orderData = buildOrderData(
        cartItems,
        shippingInfo,
        paymentMethod,
        isGuest
      );

      // Submit order
      const response = isGuest
        ? await orderService.createGuestOrder(orderData)
        : await orderService.createOrder(orderData);

      // Handle guest checkout
      if (isGuest) {
        clearGuestCart();
        saveGuestOrder(response.data.orderCode, shippingInfo.email);

        toast.success(
          `Đặt hàng thành công! Mã đơn hàng: ${response.data.orderCode}`,
          { duration: 5000 }
        );

        navigate("/order-lookup", {
          state: {
            orderCode: response.data.orderCode,
            contact: shippingInfo.email,
          },
        });
      } else {
        // Handle logged-in user checkout
        toast.success("Đặt hàng thành công!");
        setTimeout(() => {
          navigate(`/orders/${response.data.id}`);
        }, 1000);
      }

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Đặt hàng thất bại");
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
