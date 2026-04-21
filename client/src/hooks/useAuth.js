import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
  const context = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    const data = await context.login(credentials);
    const role = data?.user?.role;
    const from = location.state?.from || null;
    if (from) {
      navigate(from, { replace: true });
    } else if (['ADMIN', 'KHO', 'BAN_HANG'].includes(role?.toUpperCase())) {
      navigate('/admin-dashboard');
    } else {
      navigate('/'); 
    }
    return data;
  };

  const handleRegister = async (userData) => {
    return await context.register(userData);
  };

  const handleVerifyOtp = async (email, code) => {
    const data = await context.verifyOtp(email, code);
    // Redirect to home since user is auto-logged in
    navigate('/'); 
    return data;
  };

  const handleResendOtp = async (email) => {
    return await context.resendOtp(email);
  };

  const handleLogout = () => {
    context.logout();
    navigate('/login');
  };

  return {
    ...context,
    handleLogin,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    handleLogout,
  };
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
};

export const useIsAdmin = () => {
  const { isAdmin } = useAuthContext();
  return isAdmin();
};

export const useCurrentUser = () => {
  const { user } = useAuthContext();
  return user;
};

export const useAuthLoading = () => {
  const { loading } = useAuthContext();
  return loading;
};
export default useAuth;
