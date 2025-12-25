import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00a85a]"></div>
      </div>
    );
  }

  if (!user) {return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {return <Navigate to="/" replace />;
  }return children;
};

export default AdminRoute;
