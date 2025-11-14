const Star = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 'text-2xl' }) => {
  return (
    <span
      className={`${size} cursor-pointer transition-colors ${
        filled ? 'text-yellow-400' : 'text-gray-300'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      ★
    </span>
  );
};

export default Star;

