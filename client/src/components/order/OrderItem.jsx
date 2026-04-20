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
    <div className="flex gap-4 items-center bg-white p-3 border border-gray-50/50 transition-all hover:border-gray-200">
      <div className="relative flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.variant?.product?.name}
          className="h-16 w-16 object-cover mix-blend-multiply bg-gray-50/50 border border-gray-100"
        />
        <div className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 bg-black text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-lg">
          {item.quantity}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-black line-clamp-1 tracking-tight mb-1">
          {item.variant?.product?.name}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {item.variant?.size && (
            <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-[10px] font-semibold text-slate-500 border border-gray-100 uppercase">
              Size {item.variant.size}
            </span>
          )}
          {item.variant?.color && (
            <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-[10px] font-semibold text-slate-500 border border-gray-100 uppercase">
              {item.variant.color}
            </span>
          )}
        </div>
      </div>

      <div className="text-right pl-4">
        <p className="text-sm font-semibold text-black tracking-tight">
          {formatPrice(item.price * item.quantity)}
        </p>
        {(item.discountPrice || (item.variant?.price && item.price < item.variant.price)) && (
          <p className="text-[11px] font-medium text-gray-300 line-through">
            {formatPrice((item.variant?.price || item.price) * item.quantity)}
          </p>
        )}
      </div>
      
      {showReviewButton && (
        <div className="flex flex-col gap-2 ml-4">
          {canReview && !isReviewed && (
            <button
              onClick={onReview}
              className="inline-flex items-center gap-2 bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 shadow-md cursor-pointer"
            >
              <FaStar size={10} />
              Đánh giá
            </button>
          )}
          {isReviewed && (
            <span className="inline-flex items-center px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 border border-gray-100 bg-gray-50">
              Đã đánh giá
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
