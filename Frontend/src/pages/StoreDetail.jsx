import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeAPI, ratingAPI } from '../services/api';
import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';
import Loading from '../components/Loading';
import { toast } from '../components/ToastContainer';
import { useAuth } from '../context/AuthContext';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getStoreById(id);
      setStore(response.data);
      
    } catch (error) {
      toast('Failed to load store details', 'error');
      navigate('/dashboard/user');
    } finally {
      setLoading(false);
    }
  };

  const handleRateClick = () => {
    if (!isAuthenticated) {
      toast('Please login to rate stores', 'warning');
      navigate('/login/user');
      return;
    }
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (rating) => {
    try {
      if (userRating) {
        try {
          await ratingAPI.updateRating(userRating.id, rating);
          toast('Rating updated successfully!', 'success');
        } catch (updateError) {
          throw updateError;
        }
      } else {
        try {
          await ratingAPI.submitRating(id, rating);
          toast('Rating submitted successfully!', 'success');
        } catch (submitError) {
          if (submitError.response?.status === 409) {
            toast('You already rated this store. Update functionality coming soon.', 'warning');
            throw submitError;
          }
          throw submitError;
        }
      }
      await fetchStoreDetails();
      setIsRatingModalOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit rating';
      if (errorMsg !== 'Failed to submit rating') {
        toast(errorMsg, 'error');
      }
      throw error;
    }
  };

  if (loading) {
    return <Loading message="Loading store details..." />;
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Store not found</p>
          <button
            onClick={() => navigate('/dashboard/user')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const avgRating = parseFloat(store.avgRating || 0).toFixed(1);
  const ratingsCount = store.ratingsCount || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard/user')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{store.name}</h1>
              <div className="space-y-2">
                {store.address && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span> {store.address}
                  </p>
                )}
                {store.email && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Email:</span> {store.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={avgRating} readonly size="text-3xl" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{avgRating} / 5</p>
                <p className="text-gray-600">
                  Based on {ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {userRating && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Your Rating:</span>
                </p>
                <StarRating rating={userRating.rating} readonly size="text-xl" />
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={handleRateClick}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {userRating ? 'Update Your Rating' : 'Rate This Store'}
              </button>
            )}
          </div>
        </div>

        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          store={store}
          existingRating={userRating}
          onSubmit={handleSubmitRating}
        />
      </div>
    </div>
  );
};

export default StoreDetail;

