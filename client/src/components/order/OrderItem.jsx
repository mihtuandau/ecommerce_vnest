import { FaStar } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';

const OrderItem = ({ 
  item, 
  canReview = false, 
  isReviewed = false, 
  onReview,
  showReviewButton = true 
}) => {
  const imageUrl = item.variant?.images?.[0]?.url || 
                   item.variant?.product?.images?.[0]?.url || 
                   '/placeholder-product.jpg';

  return (
    <div className="flex gap-4 items-start rounded-2xl bg-slate-50 p-4">
      <img
        src={imageUrl}
        alt={item.variant?.product?.name}
        className="h-14 w-14 flex-shrink-0 rounded-xl border border-slate-200 bg-white object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {item.variant?.product?.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {item.variant?.size && <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">Size: {item.variant.size}</span>}
          {item.variant?.color && <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">Màu: {item.variant.color}</span>}
          <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">× {item.quantity}</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
      
      {}
      {showReviewButton && (
        <>
          {canReview && !isReviewed && (
            <button
              onClick={onReview}
              className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-black px-3 py-2 text-xs text-white transition-colors hover:bg-neutral-800"
            >
              <FaStar size={11} />
              Đánh giá
            </button>
          )}
          {isReviewed && (
            <span className="flex-shrink-0 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
              Đã đánh giá
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default OrderItem;







