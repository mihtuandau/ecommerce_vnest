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
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Chưa có đánh giá nào</p>
        <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {review.user?.name || 'Người dùng ẩn danh'}
              </p>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={review.rating} size={18} />
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>
          <span className="px-4 py-2 text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
