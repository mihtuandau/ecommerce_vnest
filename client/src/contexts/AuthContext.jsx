// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const currentUser = authService.getCurrentUser();
      
      console.log('🔍 Init Auth - Checking localStorage...');
      console.log('- Token:', token ? 'Found' : 'Not found');
      console.log('- User:', currentUser ? currentUser.email : 'Not found');
      
      // ✅ If both token and user exist, set user immediately (no verification)
      if (token && currentUser) {
        setUser(currentUser);
        console.log('✅ User restored from localStorage');
      } else {
        console.log('ℹ️ No token or user in localStorage');
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      
      toast.success('Đăng ký thành công!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      console.log('AuthContext login - received data:', data);
      setUser(data.user);
      
      toast.success('Đăng nhập thành công!');
      return data;
    } catch (error) {
      console.error('AuthContext login error:', error);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUser(data.user);
      toast.success('Cập nhật thông tin thành công!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Đổi mật khẩu thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
      throw error;
    }
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout,
        handleLogout,
        updateProfile,
        changePassword,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;