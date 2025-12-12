// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { notify } from '../utils/notification';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🔒 Fetch user from backend using httpOnly cookie
        const currentUser = await authService.verifyAuth();
        
        if (currentUser) {
          console.log('Current user from backend:', currentUser);
          setUser(currentUser);
        } else {
          console.log('No user returned from backend');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      
      notify.success('Đăng ký thành công!');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);setUser(data.user);
      
      notify.success('Đăng nhập thành công!');
      return data;
    } catch (error) {notify.error(error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      notify.success('Đăng xuất thành công!');
    } catch (error) {setUser(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUser(data.user);
      notify.success('Cập nhật thông tin thành công!');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      notify.success('Đổi mật khẩu thành công!');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
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