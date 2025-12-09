import api from '../config/api.config';

const orderService = {
  // Create new order (customer)
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  // Create guest order (no authentication required)
  createGuestOrder: async (orderData) => {
    return await api.post('/orders/guest', orderData);
  },

  // Lookup guest order by order code and contact
  lookupGuestOrder: async (orderCode, contact) => {
    return await api.get(`/orders/guest/lookup/${orderCode}`, {
      params: { contact }
    });
  },

  // Get my orders (customer)
  getMyOrders: async () => {
    return await api.get('/orders/my-orders');
  },

  // Get order by ID (customer & admin)
  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  // Get all orders (admin can see all, users see their own)
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  // Cancel order (customer - only when PENDING)
  cancelOrder: async (id) => {
    return await api.put(`/orders/${id}/cancel`);
  },

  // Get order statistics
  getStats: async () => {
    const response = await api.get('/orders', { params: { limit: 1000 } });
    return response.data;
  },
};

export default orderService;
