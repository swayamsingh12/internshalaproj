import { useState, useEffect } from 'react';
import StarRating from './StarRating';

const RatingModal = ({ isOpen, onClose, store, onSubmit, existingRating = null }) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
    } else {
      setRating(0);
    }
  }, [existingRating, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(rating);
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {existingRating ? 'Update Rating' : 'Rate Store'}
        </h2>
        {store && (
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">{store.name}</span>
          </p>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Your Rating:</label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="text-3xl"
          />
          {rating > 0 && (
            <p className="mt-2 text-gray-600">Selected: {rating} out of 5</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={loading || rating === 0}
          >
            {loading ? 'Submitting...' : existingRating ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

