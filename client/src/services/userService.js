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