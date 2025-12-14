import apiService from './apiService';
import { DASHBOARD_ENDPOINTS } from '../config/apiConstants';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get revenue analytics
  getRevenue: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.REVENUE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get recent orders
  getRecentOrders: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.RECENT_ORDERS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get top products
  getTopProducts: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.TOP_PRODUCTS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
