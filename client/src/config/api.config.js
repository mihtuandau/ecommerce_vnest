import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // 🔒 Tự động gửi httpOnly cookies với mọi request
});

// 🔒 Không cần interceptor để thêm Authorization header
// Token được lưu trong httpOnly cookie và tự động gửi bởi browser
// Backend (JWT strategy) sẽ lấy token từ cookie

export default axiosInstance;