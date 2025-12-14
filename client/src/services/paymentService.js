import api from '../config/api.config';

const paymentService = {
  // Create payment and get payment link
  createPayment: async (orderId, method = 'PAYOS') => {
    try {
      const response = await api.post('/payments', { orderId, method });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get PayOS payment info
  getPayOSPaymentInfo: async (orderCode) => {
    try {
      const response = await api.get(`/payments/payos/info/${orderCode}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment with order details by PayOS order code
  getPaymentWithOrder: async (orderCode) => {
    try {
      const response = await api.get(`/payments/payos/order/${orderCode}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel PayOS payment
  cancelPayOSPayment: async (paymentId, reason) => {
    try {
      const response = await api.post(`/payments/${paymentId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all payments with filters
  getPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  getPayment: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update payment status (Admin only)
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await api.put(`/payments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment statistics
  getStats: async () => {
    try {
      const response = await api.get('/payments/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
