import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/user');
  };

  const getDashboardPath = () => {
    if (role === 'normal') return '/dashboard/user';
    if (role === 'store_owner') return '/dashboard/owner';
    if (role === 'admin') return '/dashboard/admin';
    return '/dashboard/user';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            StoreRate
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.name}</span>
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login/user"
                  className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

