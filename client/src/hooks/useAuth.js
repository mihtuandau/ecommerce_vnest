import { useAuth as useAuthContext } from '../contexts/authContext';
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
    } else if (role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/'); 
    }
    return data;
  };

  const handleRegister = async (userData) => {
    const data = await context.register(userData);
    return data;
  };

  const handleLogout = () => {
    context.logout();
    navigate('/login');
  };

  return {
    ...context,
    handleLogin,
    handleRegister,
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