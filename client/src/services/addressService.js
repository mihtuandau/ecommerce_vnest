import apiService from "./apiService";
import { ADDRESS_ENDPOINTS } from "../config/apiConstants";

class AddressService {

  async getAddresses() {
    const response = await apiService.get(ADDRESS_ENDPOINTS.BASE);
    return response;
  }

  async getAddress(id) {
    const response = await apiService.get(ADDRESS_ENDPOINTS.BY_ID(id));
    return response;
  }

  async createAddress(data) {
    const response = await apiService.post(ADDRESS_ENDPOINTS.BASE, data);
    return response;
  }

  async updateAddress(id, data) {
    const response = await apiService.patch(ADDRESS_ENDPOINTS.BY_ID(id), data);
    return response;
  }

  async deleteAddress(id) {
    const response = await apiService.delete(ADDRESS_ENDPOINTS.BY_ID(id));
    return response;
  }

  async setDefaultAddress(id) {
    const response = await apiService.patch(ADDRESS_ENDPOINTS.SET_DEFAULT(id));
    return response;
  }
}

export default new AddressService();
