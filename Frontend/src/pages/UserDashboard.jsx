import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storeAPI, ratingAPI } from '../services/api';
import StoreList from '../components/StoreList';
import RatingModal from '../components/RatingModal';
import Loading from '../components/Loading';
import { toast } from '../components/ToastContainer';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getAllStores();
      setStores(response.data);
      
      
    } catch (error) {
      toast('Failed to load stores', 'error');
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) {
        
        params.name = searchTerm;
      }
      const response = await storeAPI.searchStores(params);
      setStores(response.data.data || response.data);
    } catch (error) {
      toast('Search failed', 'error');
      console.error('Error searching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateClick = (store) => {
    // Check if user already rated this store
    const rating = userRatings[store.id];
    setExistingRating(rating || null);
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (rating) => {
    try {
      if (existingRating) {
        // Update existing rating
        try {
          await ratingAPI.updateRating(existingRating.id, rating);
          toast('Rating updated successfully!', 'success');
        } catch (updateError) {
          
          throw updateError;
        }
      } else {
        // Create new rating
        try {
          await ratingAPI.submitRating(selectedStore.id, rating);
          toast('Rating submitted successfully!', 'success');
        } catch (submitError) {
          // If user already rated (409), try to update
          if (submitError.response?.status === 409) {
            toast('You already rated this store. Update functionality coming soon.', 'warning');
            throw submitError;
          }
          throw submitError;
        }
      }
      
      // Refresh stores to get updated ratings
      await fetchStores();
      setIsRatingModalOpen(false);
      setSelectedStore(null);
      setExistingRating(null);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit rating';
      if (errorMsg !== 'Failed to submit rating') {
        toast(errorMsg, 'error');
      }
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}!
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              onClick={fetchStores}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <StoreList
          stores={stores}
          loading={loading}
          userRatings={userRatings}
          onRateClick={handleRateClick}
        />

        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedStore(null);
            setExistingRating(null);
          }}
          store={selectedStore}
          existingRating={existingRating}
          onSubmit={handleSubmitRating}
        />
      </div>
    </div>
  );
};

export default UserDashboard;

