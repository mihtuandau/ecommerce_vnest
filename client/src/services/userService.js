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
}

export default new UserService();