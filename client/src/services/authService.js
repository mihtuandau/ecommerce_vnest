// src/services/authService.js
import axiosInstance from "../config/api.config";

const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Chỉ lưu user info vào localStorage
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    const { user } = response.data;
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Chỉ lưu user info vào localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      // Gọi backend để clear httpOnly cookie
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Chỉ xóa user info (không có token trong localStorage)
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // 🔒 Token trong httpOnly cookie, không thể lấy từ JS
  getToken: () => null,

  // 🔒 Kiểm tra authentication bằng cách kiểm tra user info
  isAuthenticated: () => !!localStorage.getItem("user"),

  updateProfile: async (userData) => {
    const response = await axiosInstance.put("/users/profile", userData);
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
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
