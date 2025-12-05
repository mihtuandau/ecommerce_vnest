import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  
  timeout: 10000,
  withCredentials: true, // 🔒 Tự động gửi httpOnly cookies với mọi request
});

// 🔒 Không cần interceptor để thêm Authorization header
// Token được lưu trong httpOnly cookie và tự động gửi bởi browser
// Backend (JWT strategy) sẽ lấy token từ cookie

export default axiosInstance;