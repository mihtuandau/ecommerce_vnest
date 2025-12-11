import axiosInstance from "../config/api.config.js";

class AddressService {
  /**
   * Get all addresses of current user
   */
  async getAddresses() {
    const response = await axiosInstance.get('/addresses');
    return response.data;
  }

  /**
   * Get address by ID
   */
  async getAddress(id) {
    const response = await axiosInstance.get(`/addresses/${id}`);
    return response.data;
  }

  /**
   * Create new address
   */
  async createAddress(data) {
    const response = await axiosInstance.post('/addresses', data);
    return response.data;
  }

  /**
   * Update address
   */
  async updateAddress(id, data) {
    const response = await axiosInstance.patch(`/addresses/${id}`, data);
    return response.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(id) {
    const response = await axiosInstance.delete(`/addresses/${id}`);
    return response.data;
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(id) {
    const response = await axiosInstance.patch(`/addresses/${id}/set-default`);
    return response.data;
  }
}

export default new AddressService();
