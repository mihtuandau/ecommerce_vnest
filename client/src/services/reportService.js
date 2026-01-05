import apiService from './apiService';
import axiosClient from '../config/apiClient';

const reportService = {
  // Get revenue report (daily/monthly/yearly)
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

  // Get orders report by status
  getOrdersReport: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/orders', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get top selling products
  getTopProducts: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/top-products', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get top selling categories
  getTopCategories: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/top-categories', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get customer statistics
  getCustomerReport: async (params = {}) => {
    try {
      const response = await apiService.get('/reports/customers', params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get comprehensive summary report
  getSummaryReport: async (params = {}) => {
    try {
      console.log('Calling /reports/summary with params:', params);
      const response = await apiService.get('/reports/summary', params);
      console.log('Summary report response:', response);
      return response;
    } catch (error) {
      console.error('Summary report error:', error);
      throw error;
    }
  },

  // Export report to Excel
  exportToExcel: async (params = {}) => {
    try {
      const response = await axiosClient.get('/reports/export', {
        params,
        responseType: 'blob'
      });
      
      // Create download link
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
