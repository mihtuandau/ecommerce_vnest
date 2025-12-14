import apiService from "./apiService";
import { ADDRESS_ENDPOINTS } from "../config/apiConstants";

class AddressService {
  /**
   * Get all addresses of current user
   */
  async getAddresses() {
    const response = await apiService.get(ADDRESS_ENDPOINTS.BASE);
    return response;
  }

  /**
   * Get address by ID
   */
  async getAddress(id) {
    const response = await apiService.get(ADDRESS_ENDPOINTS.BY_ID(id));
    return response;
  }

  /**
   * Create new address
   */
  async createAddress(data) {
    const response = await apiService.post(ADDRESS_ENDPOINTS.BASE, data);
    return response;
  }

  /**
   * Update address
   */
  async updateAddress(id, data) {
    const response = await apiService.patch(ADDRESS_ENDPOINTS.BY_ID(id), data);
    return response;
  }

  /**
   * Delete address
   */
  async deleteAddress(id) {
    const response = await apiService.delete(ADDRESS_ENDPOINTS.BY_ID(id));
    return response;
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(id) {
    const response = await apiService.patch(ADDRESS_ENDPOINTS.SET_DEFAULT(id));
    return response;
  }
}

export default new AddressService();
