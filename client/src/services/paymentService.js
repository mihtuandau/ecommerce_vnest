import apiService from './apiService';
import { PAYMENT_ENDPOINTS } from '../config/apiConstants';

const paymentService = {
  // Create payment and get payment link
  createPayment: async (orderId, method = 'PAYOS') => {
    try {
      const response = await apiService.post(PAYMENT_ENDPOINTS.BASE, { orderId, method });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get PayOS payment info
  getPayOSPaymentInfo: async (orderCode) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.PAYOS_INFO(orderCode));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment with order details by PayOS order code
  getPaymentWithOrder: async (orderCode) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.PAYOS_ORDER(orderCode));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel PayOS payment
  cancelPayOSPayment: async (paymentId, reason) => {
    try {
      const response = await apiService.post(PAYMENT_ENDPOINTS.CANCEL(paymentId), { reason });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all payments with filters
  getPayments: async (params = {}) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.BASE, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  getPayment: async (id) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.BY_ID(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update payment status (Admin only)
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await apiService.put(PAYMENT_ENDPOINTS.STATUS(id), { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment statistics
  getStats: async () => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
