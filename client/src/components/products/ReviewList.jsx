import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import reviewService from '../../services/reviewService';

const Stars = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star
        key={i}
        size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
      />
    ))}
  </div>
);

const RatingSummary = ({ reviews, product }) => {
  const avg = product?.averageRating || 0;
  const total = product?.reviewCount || reviews.length;

  const counts = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="flex items-start gap-10 mb-8 pb-8 border-b border-gray-100">
      {/* Left: big number */}
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-5xl font-black text-gray-900 leading-none">{avg.toFixed(1)}</span>
        <Stars rating={avg} size={16} />
        <span className="text-xs text-gray-400 mt-1">{total} lượt đánh giá</span>
      </div>

      {/* Right: bars */}
      <div className="flex-1 flex flex-col gap-1.5">
        {counts.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-2">{star}</span>
              <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewList = ({ productId, product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    reviewService.getProductReviews(productId, page, 10)
      .then(data => {
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, page]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Rating summary — always show */}
      <RatingSummary reviews={reviews} product={product} />

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Chưa có đánh giá nào</p>
          <p className="text-xs text-gray-400 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const initial = (review.user?.name || 'N')[0].toUpperCase();
            return (
              <div key={review.id} className="bg-gray-50/60 rounded-xl p-5 border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{review.user?.name || 'Người dùng'}</span>
                      {review.isVerifiedPurchase !== false && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          ✓ Đã mua
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Stars rating={review.rating} size={12} />
                      <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                )}

                {/* Images */}
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Ảnh đánh giá ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-400 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Trước
              </button>
              <span className="text-sm text-gray-500">Trang {page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-400 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
