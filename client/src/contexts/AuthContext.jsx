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
        const currentUser = await authService.verifyAuth();
        
        if (currentUser) {
          setUser(currentUser);
        } else {
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleAuthExpired = () => {
      setUser(null);
      localStorage.removeItem('access_token');
      notify.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);

      notify.success(data.message || 'Mã xác thực đã được gửi tới email của bạn');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const verifyOtp = async (email, code) => {
    try {
      const data = await authService.verifyOtp(email, code);
      notify.success(data.message || 'Xác thực tài khoản thành công!');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Xác thực thất bại');
      throw error;
    }
  };

  const resendOtp = async (email) => {
    try {
      const data = await authService.resendOtp(email);
      notify.success(data.message || 'Mã xác thực mới đã được gửi');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Gửi lại mã thất bại');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      
      window.dispatchEvent(new Event('userLoggedIn'));
      
      notify.success('Đăng nhập thành công!');
      return data;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đăng nhập thất bại');
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

  const refreshUser = async () => {
    try {
      const currentUser = await authService.verifyAuth();
      if (currentUser) {
        setUser(currentUser);
      }
      return currentUser;
    } catch (error) {
      return null;
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

  const hasPermission = (permissionName) => {
    if (isAdmin()) return true; 
    return user?.permissions?.includes(permissionName) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        verifyOtp,
        resendOtp,
        login,
        logout,
        handleLogout,
        updateProfile,
        refreshUser,
        changePassword,
        isAdmin,
        hasPermission,
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





