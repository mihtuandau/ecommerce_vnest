import apiService from "./apiService";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "../config/apiConstants";

const authService = {
  verifyAuth: async () => {
    try {
      // Backend reads 'access_token' from cookie
      const response = await apiService.get(AUTH_ENDPOINTS.ME);
      return response;
    } catch (error) {
      return null;
    }
  },

  register: async (userData) => {
    const response = await apiService.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response;
  },

  verifyOtp: async (email, code) => {
    const response = await apiService.post(`${AUTH_ENDPOINTS.BASE}/verify-otp`, { email, code });
    // Token is automatically set in cookie by the backend response
    return response;
  },

  resendOtp: async (email) => {
    return apiService.post(`${AUTH_ENDPOINTS.BASE}/resend-otp`, { email });
  },

  login: async (credentials) => {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);
    // Token is automatically set in cookie by the backend response
    return response;
  },
  
  logout: async () => {
    try {
      await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
    }
    // Cookie is cleared by the backend
  },

  getToken: () => null, // No longer used as tokens are in HttpOnly cookies

  updateProfile: async (userData) => {
    const response = await apiService.put(USER_ENDPOINTS.PROFILE, userData);
    return response;
  },

  changePassword: async (passwordData) => {
    const response = await apiService.put(
      USER_ENDPOINTS.CHANGE_PASSWORD,
      passwordData
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
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    window.location.href = `${baseUrl}/api${AUTH_ENDPOINTS.GOOGLE_LOGIN}`;
  },

  getAllPermissions: async () => {
    return apiService.get(`${AUTH_ENDPOINTS.BASE}/permissions`);
  },

  getRolesWithPermissions: async () => {
    return apiService.get(`${AUTH_ENDPOINTS.BASE}/roles-permissions`);
  },

  updateRolePermissions: async (data) => {
    return apiService.post(`${AUTH_ENDPOINTS.BASE}/roles-permissions`, data);
  },
};

export default authService;
