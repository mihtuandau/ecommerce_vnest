import apiService from './apiService';
import { PAYMENT_ENDPOINTS } from '../config/apiConstants';

const paymentService = {
  createPayment: async (orderId, method = 'PAYOS') => {
    try {
      const response = await apiService.post(PAYMENT_ENDPOINTS.BASE, { orderId, method });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getPayOSPaymentInfo: async (orderCode) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.PAYOS_INFO(orderCode));
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPaymentWithOrder: async (orderCode) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.PAYOS_ORDER(orderCode));
      return response;
    } catch (error) {
      throw error;
    }
  },

  cancelPayOSPayment: async (paymentId, reason) => {
    try {
      const response = await apiService.post(PAYMENT_ENDPOINTS.CANCEL(paymentId), { reason });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getPayments: async (params = {}) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.BASE, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPayment: async (id) => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.BY_ID(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePaymentStatus: async (id, status) => {
    try {
      const response = await apiService.put(PAYMENT_ENDPOINTS.STATUS(id), { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  syncPaymentStatus: async (id) => {
    try {
      const response = await apiService.post(`${PAYMENT_ENDPOINTS.BASE}/${id}/sync`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await apiService.get(PAYMENT_ENDPOINTS.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyPaymentReturn: async (orderCode) => {
    try {
      const response = await apiService.get(`/webhooks/payments/payos/verify/${orderCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyVNPayReturn: async (vnpParams) => {
    try {
      // VNPay returns result via query params, we send them to our backend return endpoint
      const response = await apiService.get('/payments/vnpay-return', vnpParams);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;






