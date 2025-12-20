import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import OrderStatusBadge from './OrderStatusBadge';
import OrderItem from './OrderItem';

const OrderCard = ({ 
  order, 
  reviewedProducts = new Set(),
  onReviewClick,
  onCancelClick
}) => {
  const navigate = useNavigate();

  const isOrderCompletedForReview = 
    order.status === 'DELIVERED' && order.payment?.status === 'SUCCESS';

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-normal text-gray-900">
            {order.orderCode || `#${order.id}`}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaClock size={12} />
          {formatDateTime(order.createdAt)}
        </div>
      </div>

      {/* Order Content */}
      <div className="px-6 py-5">
        <div className="space-y-4 mb-5">
          {order.items?.slice(0, 2).map((item, idx) => {
            const productId = item.variant?.product?.id || item.variant?.productId;
            const reviewKey = `${productId}-${order.id}`;
            const isReviewed = reviewedProducts.has(reviewKey);
            const canShowReviewButton = isOrderCompletedForReview && !isReviewed;

            return (
              <OrderItem
                key={idx}
                item={item}
                canReview={canShowReviewButton}
                isReviewed={isReviewed}
                onReview={() => onReviewClick(item, order.id)}
                showReviewButton={isOrderCompletedForReview}
              />
            );
          })}
          
          {order.items?.length > 2 && (
            <p className="text-sm text-gray-600 text-center py-2">
              +{order.items.length - 2} sản phẩm khác
            </p>
          )}
        </div>

        {/* Order Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-200 flex-wrap gap-3">
          <div>
            <span className="text-sm text-gray-600">Tổng tiền: </span>
            <span className="text-lg font-light text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {(order.status === 'PENDING' || order.status === 'AWAITING_PAYMENT') && (
              <button
                onClick={() => onCancelClick(order.id)}
                className="px-4 py-2 border border-red-600 hover:border-red-900 text-red-600 text-sm transition-colors"
              >
                Hủy đơn
              </button>
            )}
            <button
              onClick={() => navigate(`/orders/${order.id}`)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
