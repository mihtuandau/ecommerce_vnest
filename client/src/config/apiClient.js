import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL ,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL ,
  TIMEOUT: 10000,
};

const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, 
});


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already a retry, attempt to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/logout') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The backend /auth/refresh endpoint reads the refresh_token from cookies
        await axiosClient.post('/auth/refresh');
        
        processQueue(null);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Nếu refresh thất bại, thông báo cho toàn app để logout user
        // Chặn thông báo nếu đây là yêu cầu kiểm tra ban đầu (/auth/me) để tránh làm phiền khách vãng lai
        if (
          typeof window !== 'undefined' && 
          !originalRequest.url?.includes('/auth/logout') &&
          !originalRequest.url?.includes('/auth/me')
        ) {
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
