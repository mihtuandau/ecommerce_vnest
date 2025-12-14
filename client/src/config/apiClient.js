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


export default axiosClient;