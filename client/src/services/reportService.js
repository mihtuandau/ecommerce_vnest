import apiService from './apiService';
import axiosClient from '../config/apiClient';

const reportService = {
  getRevenueReport: async (params = {}) => {
    try {
      console.log('Calling /reports/revenue with params:', params);
      const response = await apiService.get('/reports/revenue', params);
      console.log('Revenue report response:', response);
      return response;
    } catch (error) {
      console.error('Revenue report error:', error);
      throw error;
    }
  },

  getOrdersReport: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/orders', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTopProducts: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/top-products', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTopCategories: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/top-categories', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCustomerReport: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/customers', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getSummaryReport: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/summary', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  exportToExcel: async (params = {}) => {
    try {
      const response = await axiosClient.get('/reports/export', {
        params,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `report_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

export default reportService;
