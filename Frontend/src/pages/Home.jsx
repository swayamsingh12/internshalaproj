import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'store_owner') return '/dashboard/owner';
    return '/dashboard/user';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">StoreRate</h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-role Rating Platform - Rate stores, manage your business, or administer the platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isAuthenticated ? (
            <div className="text-center">
              <Link
                to={getDashboardPath()}
                className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">User</h2>
                <p className="text-gray-600 mb-4">
                  Browse stores, search, and rate your favorite places
                </p>
                <Link
                  to="/login/user"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  User Login
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Store Owner</h2>
                <p className="text-gray-600 mb-4">
                  Manage your stores and view ratings from customers
                </p>
                <Link
                  to="/login/owner"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Owner Login
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Admin</h2>
                <p className="text-gray-600 mb-4">
                  Manage stores, assign owners, and oversee the platform
                </p>
                <Link
                  to="/login/admin"
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

