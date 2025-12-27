import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Don't show separate loading - let Suspense handle it
  if (loading) {
    return null; // Or return children to avoid flash
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;
