import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import StarRating from '../common/StarRating';
import reviewService from '../../services/reviewService';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReviews();
  }, [productId, page]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getProductReviews(productId, page, 10);
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200">
        <p className="text-gray-600">Chưa có đánh giá nào</p>
        <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-colors">
          {/* User avatar - square */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div>
              <p className="font-normal text-gray-900">{review.user?.name || 'Người dùng'}</p>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>

          <div className="mb-3">
            <StarRating rating={review.rating} size={16} />
          </div>

          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}

          {/* Review images - square */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-4">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-20 h-20 object-cover border border-gray-200 hover:border-gray-900 transition-colors cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pagination - minimalist */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button className="px-4 py-2 border border-gray-300 hover:border-gray-900 disabled:opacity-50">
            Trước
          </button>
          <span className="px-4 py-2 text-gray-700">Trang {page} / {totalPages}</span>
          <button className="px-4 py-2 border border-gray-300 hover:border-gray-900 disabled:opacity-50">
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
