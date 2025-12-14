import apiService from "./apiService";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "../config/apiConstants";

const authService = {
  // 🔒 Verify user from httpOnly cookie (no localStorage)
  verifyAuth: async () => {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.ME);
      return response;
    } catch (error) {
      return null;
    }
  },

  register: async (userData) => {
    const response = await apiService.post(AUTH_ENDPOINTS.REGISTER, userData);
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Không lưu gì vào localStorage
    return response;
  },

  login: async (credentials) => {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);
    // 🔒 Token được lưu trong httpOnly cookie bởi backend
    // Không lưu gì vào localStorage
    return response;
  },
  
  logout: async () => {
    try {
      // Gọi backend để clear httpOnly cookie
      await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {} finally {
      // Không xóa localStorage vì không lưu gì cả
      window.location.href = "/login";
    }
  },

  // 🔒 Token trong httpOnly cookie, không thể lấy từ JS
  getToken: () => null,

  updateProfile: async (userData) => {
    const response = await apiService.put(USER_ENDPOINTS.PROFILE, userData);
    return response;
  },

  changePassword: async (passwordData) => {
    const token = authService.getToken();
    const response = await apiService.put(
      USER_ENDPOINTS.CHANGE_PASSWORD,
      passwordData,
      { Authorization: `Bearer ${token}` }
    );
    return response;
  },

  forgotPassword: async (email) => {
    const response = await apiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response;
  },

  resetPassword: async (token, email, password) => {
    const response = await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      email,
      password,
    });
    return response;
  },

  googleLogin: () => {
    // Redirect to backend Google OAuth endpoint - API URL already correct
    window.location.href = `http://localhost:5000/api${AUTH_ENDPOINTS.GOOGLE_LOGIN}`;
  },
};

export default authService;
