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
    const response = await axiosInstance.post(`/users/${userId}/address`, data);
    return response.data;
  }

  async updateAddress(userId, addressId, data) {
    const response = await axiosInstance.put(`/users/${userId}/address/${addressId}`, data);
    return response.data;
  }

  async getAddresses(userId) {
    return this.request(`/users/${userId}/addresses`);
  }

  async deleteAddress(userId, addressId) {
    return this.request(`/users/${userId}/address/${addressId}`, {
      method: 'DELETE',
    });
  }

  async setDefaultAddress(userId, addressId) {
    return this.request(`/users/${userId}/address/${addressId}/default`, {
      method: 'PUT',
    });
  }

  // Get current user profile
  async getProfile() {
    return this.request('/users/profile');
  }

  // Update current user profile
  async updateProfile(data) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export default new UserService();