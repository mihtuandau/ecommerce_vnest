import apiService from './apiService';
import { DASHBOARD_ENDPOINTS } from '../config/apiConstants';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getRevenue: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.REVENUE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getRecentOrders: async () => {
    try {
      const response = await apiService.get(DASHBOARD_ENDPOINTS.RECENT_ORDERS);
      return response;
    } catch (error) {
      throw error;
    }
  },

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






