import apiService from "./apiService";
import { USER_ENDPOINTS } from "../config/apiConstants";

class UserService {
  // 🔒 Dùng apiService (tự động gửi httpOnly cookie)
  
  // User APIs
  async getUsers(params = {}) {
    const response = await apiService.get(USER_ENDPOINTS.BASE, params);
    return response;
  }

  async getUser(id) {
    const response = await apiService.get(USER_ENDPOINTS.BY_ID(id));
    return response;
  }

  async createUser(data) {
    const response = await apiService.post(USER_ENDPOINTS.BASE, data);
    return response;
  }

  async updateUser(id, data) {
    const response = await apiService.put(USER_ENDPOINTS.BY_ID(id), data);
    return response;
  }

  async deleteUser(id) {
    const response = await apiService.delete(USER_ENDPOINTS.BY_ID(id), { confirm: true });
    return response;
  }

  // Get current user profile
  async getProfile() {
    const response = await apiService.get(USER_ENDPOINTS.PROFILE);
    return response;
  }

  // Update current user profile
  async updateProfile(data) {
    const response = await apiService.put(USER_ENDPOINTS.PROFILE, data);
    return response;
  }
}

export default new UserService();