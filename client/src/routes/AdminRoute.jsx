import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  console.log('AdminRoute - user from localStorage:', user);
  console.log('AdminRoute - user.role:', user?.role);

  // 🔒 Token is now managed via httpOnly cookie, no need to check token here
  // Only check if user has ADMIN role

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
