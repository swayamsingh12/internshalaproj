import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ownerAPI } from '../services/api';
import Loading from '../components/Loading';
import StarRating from '../components/StarRating';
import { toast } from '../components/ToastContainer';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [raters, setRaters] = useState([]);
  const [loadingRaters, setLoadingRaters] = useState(false);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const response = await ownerAPI.getMyStores();
      setStores(response.data);
    } catch (error) {
      toast('Failed to load stores', 'error');
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRaters = async (storeId) => {
    try {
      setLoadingRaters(true);
      const response = await ownerAPI.getStoreRaters(storeId);
      setRaters(response.data.ratings || []);
      setSelectedStore(response.data.store);
    } catch (error) {
      toast('Failed to load raters', 'error');
      console.error('Error fetching raters:', error);
    } finally {
      setLoadingRaters(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your stores..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 mb-6">Manage your stores and view ratings</p>

        {stores.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">You don't own any stores yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Stores</h2>
              <div className="space-y-4">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-semibold">Address:</span> {store.address || 'N/A'}
                    </p>
                    {store.email && (
                      <p className="text-gray-600 text-sm mb-4">
                        <span className="font-semibold">Email:</span> {store.email}
                      </p>
                    )}

                    <div className="border-t pt-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating
                          rating={parseFloat(store.avgRating || 0)}
                          readonly
                          size="text-lg"
                        />
                        <span className="text-gray-700 font-semibold">
                          {parseFloat(store.avgRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Total Reviews: <span className="font-semibold">{store.ratingsCount || 0}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleViewRaters(store.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View Raters
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {selectedStore ? `${selectedStore.name} - Raters` : 'Select a store to view raters'}
              </h2>
              {loadingRaters ? (
                <Loading message="Loading raters..." />
              ) : selectedStore && raters.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Average Rating:{' '}
                      <span className="font-semibold">
                        {parseFloat(selectedStore.avgRating || 0).toFixed(1)}/5
                      </span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    {raters.map((rater) => (
                      <div
                        key={rater.id}
                        className="border-b pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{rater.user?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{rater.user?.email}</p>
                            {rater.user?.address && (
                              <p className="text-xs text-gray-500">{rater.user.address}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <StarRating rating={rater.rating} readonly size="text-lg" />
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(rater.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedStore && raters.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">No ratings yet for this store.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">Select a store to view its raters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;

