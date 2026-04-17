import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cho phép Admin và các nhân viên (KHO, BAN_HANG) truy cập. Chỉ chặn CUSTOMER.
  if (user.role === 'CUSTOMER') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;
