import axiosInstance from "../config/api.config.js"; 
class UserService {
  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // User APIs
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ confirm: true }),
    });
  }

  // Address APIs
  async createAddress(userId, data) {
    return this.request(`/users/${userId}/address`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAddress(userId, addressId, data) {
    return this.request(`/users/${userId}/address/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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