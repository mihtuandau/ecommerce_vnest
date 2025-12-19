import apiService from './apiService';
import { ORDER_ENDPOINTS } from '../config/apiConstants';

const orderService = {
  // Create new order (customer)
  createOrder: async (orderData) => {
    try {
      console.log('📤 Sending createOrder request to:', ORDER_ENDPOINTS.BASE, orderData);
      const response = await apiService.post(ORDER_ENDPOINTS.BASE, orderData);
      console.log('✅ createOrder response:', response);
      return response;
    } catch (error) {
      console.error('❌ createOrder error:', error);
      throw error;
    }
  },

  // Create guest order (no authentication required)
  createGuestOrder: async (orderData) => {
    try {
      console.log('📤 Sending createGuestOrder request to:', ORDER_ENDPOINTS.GUEST_ORDER, orderData);
      const response = await apiService.post(ORDER_ENDPOINTS.GUEST_ORDER, orderData);
      console.log('✅ createGuestOrder response:', response);
      return response;
    } catch (error) {
      console.error('❌ createGuestOrder error:', error);
      throw error;
    }
  },

  // Lookup guest order by order code and contact
  lookupGuestOrder: async (orderCode, contact) => {
    return await apiService.get(`${ORDER_ENDPOINTS.GUEST_LOOKUP(orderCode)}?contact=${encodeURIComponent(contact)}`);
  },

  // Get my orders (customer)
  getMyOrders: async () => {
    return await apiService.get(ORDER_ENDPOINTS.MY_ORDERS);
  },

  // Get order by ID (customer & admin)
  getOrderById: async (id) => {
    return await apiService.get(ORDER_ENDPOINTS.BY_ID(id));
  },

  // Get all orders (admin can see all, users see their own)
  getOrders: async (params = {}) => {
    const response = await apiService.get(ORDER_ENDPOINTS.BASE, params);
    return response;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await apiService.get(ORDER_ENDPOINTS.BY_ID(id));
    return response;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await apiService.put(ORDER_ENDPOINTS.BY_ID(id), { status });
    return response;
  },

  // Cancel order (customer - only when PENDING)
  cancelOrder: async (id) => {
    return await apiService.put(ORDER_ENDPOINTS.CANCEL(id));
  },

  // Get order statistics
  getStats: async () => {
    const response = await apiService.get(ORDER_ENDPOINTS.BASE, { limit: 1000 });
    return response;
  },
};

export default orderService;
