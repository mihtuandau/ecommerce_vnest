// src/services/authService.js
import axiosInstance from "../config/api.config";

const authService = {
  // 🔒 Verify user from httpOnly cookie (no localStorage)
  verifyAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Không lưu gì vào localStorage
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Không lưu gì vào localStorage
    return response.data;
  },
  
  logout: async () => {
    try {
      // Gọi backend để clear httpOnly cookie
      await axiosInstance.post("/auth/logout");
    } catch (error) {} finally {
      // Không xóa localStorage vì không lưu gì cả
      window.location.href = "/login";
    }
  },

  // 🔒 Token trong httpOnly cookie, không thể lấy từ JS
  getToken: () => null,

  updateProfile: async (userData) => {
    const response = await axiosInstance.put("/users/profile", userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const token = authService.getToken();
    const response = await axiosInstance.put(
      "/user/change-password",
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, email, password) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      email,
      password,
    });
    return response.data;
  },

  googleLogin: () => {
    // Redirect to backend Google OAuth endpoint - API URL already correct
    window.location.href = `http://localhost:5000/api/auth/google`;
  },
};

export default authService;
