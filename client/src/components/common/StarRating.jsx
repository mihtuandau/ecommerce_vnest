import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, size = 16, showNumber = false, reviewCount = 0 }) => {
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} size={size} />
        ))}
        {hasHalfStar && <FaStarHalfAlt size={size} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} size={size} />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {validRating.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
