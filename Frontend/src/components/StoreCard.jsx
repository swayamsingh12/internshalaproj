import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const StoreCard = ({ store, userRating = null, onRateClick }) => {
  const avgRating = parseFloat(store.avgRating || 0).toFixed(1);
  const ratingsCount = store.ratingsCount || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-semibold">Address:</span> {store.address || 'N/A'}
          </p>
          {store.email && (
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-semibold">Email:</span> {store.email}
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StarRating rating={avgRating} readonly size="text-lg" />
              <span className="text-gray-700 font-semibold">{avgRating}</span>
              <span className="text-gray-500 text-sm">({ratingsCount} reviews)</span>
            </div>
            {userRating && (
              <p className="text-sm text-gray-600">
                Your rating: <span className="font-semibold">{userRating.rating}/5</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/stores/${store.id}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
          {onRateClick && (
            <button
              onClick={() => onRateClick(store)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {userRating ? 'Update Rating' : 'Rate Store'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;

