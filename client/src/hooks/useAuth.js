import { useAuth as useAuthContext } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

// Wrapper hook: exposes context and provides aliases expected by components
export const useAuth = () => {
  const context = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const data = await context.login(credentials);
    const role = data?.user?.role;
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl, { replace: true });
    } else if (role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/home'); 
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