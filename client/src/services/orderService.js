import apiService from './apiService';
import { ORDER_ENDPOINTS } from '../config/apiConstants';

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await apiService.post(ORDER_ENDPOINTS.BASE, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createGuestOrder: async (orderData) => {
    try {
      const response = await apiService.post(ORDER_ENDPOINTS.GUEST_ORDER, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  lookupGuestOrder: async (orderCode, contact) => {
    return await apiService.get(`${ORDER_ENDPOINTS.GUEST_LOOKUP(orderCode)}?contact=${encodeURIComponent(contact)}`);
  },

  getMyOrders: async () => {
    return await apiService.get(ORDER_ENDPOINTS.MY_ORDERS);
  },

  getOrderById: async (id) => {
    return await apiService.get(ORDER_ENDPOINTS.BY_ID(id));
  },

  getOrders: async (params = {}) => {
    const response = await apiService.get(ORDER_ENDPOINTS.BASE, params);
    return response;
  },

  getOrder: async (id) => {
    const response = await apiService.get(ORDER_ENDPOINTS.BY_ID(id));
    return response;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiService.put(ORDER_ENDPOINTS.BY_ID(id), { status });
    return response;
  },

  cancelOrder: async (id) => {
    return await apiService.put(ORDER_ENDPOINTS.CANCEL(id));
  },

  getStats: async () => {
    const response = await apiService.get(ORDER_ENDPOINTS.BASE, { limit: 1000 });
    return response;
  },
};

export default orderService;
