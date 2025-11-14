import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/user" replace />;
  }

  // If specific roles are required, check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'normal') {
      return <Navigate to="/dashboard/user" replace />;
    } else if (role === 'store_owner') {
      return <Navigate to="/dashboard/owner" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return <Navigate to="/login/user" replace />;
  }

  return children;
};

export default ProtectedRoute;

