import React from 'react';
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
    <div className="flex gap-4 items-start">
      <img
        src={imageUrl}
        alt={item.variant?.product?.name}
        className="w-20 h-20 object-cover border border-gray-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-normal text-gray-900 line-clamp-2">
          {item.variant?.product?.name}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          {item.variant?.size && <span>{item.variant.size}</span>}
          {item.variant?.color && <span>{item.variant.color}</span>}
          <span>× {item.quantity}</span>
        </div>
        <p className="text-sm text-gray-900 mt-2">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
      
      {/* Review Button/Status */}
      {showReviewButton && (
        <>
          {canReview && !isReviewed && (
            <button
              onClick={onReview}
              className="px-3 py-2 text-xs bg-gray-900 hover:bg-gray-800 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              <FaStar size={11} />
              Đánh giá
            </button>
          )}
          {isReviewed && (
            <span className="text-xs text-gray-600 border border-gray-300 px-3 py-2 whitespace-nowrap flex-shrink-0">
              Đã đánh giá
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default OrderItem;
