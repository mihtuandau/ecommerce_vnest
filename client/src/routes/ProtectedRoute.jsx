// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user?.email);
  console.log('ProtectedRoute - loading:', loading);
  console.log('ProtectedRoute - location:', location.pathname);

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
    console.log('ProtectedRoute - No user found, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering protected component');
  return children;
};

export default ProtectedRoute;
