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

// Add token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;