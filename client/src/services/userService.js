import axiosInstance from "../config/api.config.js"; 

class UserService {
  // 🔒 Dùng axios instance (tự động gửi httpOnly cookie)
  
  // User APIs
  async getUsers(params = {}) {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  }

  async getUser(id) {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data) {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  }

  async updateUser(id, data) {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id) {
    const response = await axiosInstance.delete(`/users/${id}`, {
      data: { confirm: true }
    });
    return response.data;
  }

  // Address APIs
  async createAddress(userId, data) {
    const response = await axiosInstance.post(`/users/${userId}/addresses`, data);
    return response.data;
  }

  async updateAddress(userId, addressId, data) {
    const response = await axiosInstance.put(`/users/${userId}/addresses/${addressId}`, data);
    return response.data;
  }

  async getAddresses(userId) {
    const response = await axiosInstance.get(`/users/${userId}/addresses`);
    return response.data;
  }

  async deleteAddress(userId, addressId) {
    const response = await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  }

  async setDefaultAddress(userId, addressId) {
    const response = await axiosInstance.put(`/users/${userId}/addresses/${addressId}/default`);
    return response.data;
  }

  // Get current user profile
  async getProfile() {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  }

  // Update current user profile
  async updateProfile(data) {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  }
}

export default new UserService();