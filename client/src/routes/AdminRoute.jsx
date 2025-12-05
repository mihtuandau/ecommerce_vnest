import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AdminRoute - user:', user?.email);
  console.log('AdminRoute - user.role:', user?.role);
  console.log('AdminRoute - loading:', loading);

  // Wait for auth to initialize
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔒 User fetched from backend via httpOnly cookie
  if (!user) {
    console.log('AdminRoute - No user found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    console.log('AdminRoute - User role is not ADMIN, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - User is ADMIN, rendering admin component');
  return children;
};

export default AdminRoute;
