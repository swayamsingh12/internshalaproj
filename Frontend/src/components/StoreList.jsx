import { useState } from 'react';
import StoreCard from './StoreCard';
import Loading from './Loading';

const StoreList = ({ stores, loading, userRatings = {}, onRateClick }) => {
  if (loading) {
    return <Loading message="Loading stores..." />;
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No stores found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          userRating={userRatings[store.id] || null}
          onRateClick={onRateClick}
        />
      ))}
    </div>
  );
};

export default StoreList;

