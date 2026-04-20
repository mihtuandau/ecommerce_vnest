import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaClock, FaChevronRight } from "react-icons/fa";
import { formatPrice, formatDateTime } from "../../utils/formatters";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItem from "./OrderItem";

const OrderCard = ({
  order,
  reviewedProducts = new Set(),
  onReviewClick,
  onCancelClick,
}) => {
  const navigate = useNavigate();

  const isOrderCompletedForReview =
    order.status === "DELIVERED" && order.payment?.status === "SUCCESS";

  return (
    <div className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 mb-4 overflow-hidden">
      {/* Header - Mảnh mai */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-50 bg-gray-50/20">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400">Mã đơn hàng</span>
            <span className="text-[11px] font-bold text-gray-800 font-mono">
              {order.orderCode || `#${order.id.slice(-8).toUpperCase()}`}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                order.payment?.status === 'SUCCESS' || order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {order.payment?.status === 'SUCCESS' || order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </span>
            </div>
          </div>
          <div className="hidden xs:block h-8 w-px bg-gray-200"></div>
          <div className="hidden xs:flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400">Ngày đặt</span>
            <span className="text-[11px] font-medium text-gray-500">
              {formatDateTime(order.createdAt).split(' ')[0]}
            </span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Sản phẩm */}
      <div className="p-3 sm:p-4">
        <div className="space-y-2">
          {order.items?.slice(0, 1).map((item, idx) => (
            <OrderItem
              key={idx}
              item={item}
              showReviewButton={false} 
            />
          ))}

          {order.items?.length > 1 && (
            <button 
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full py-2 text-[10px] font-semibold text-gray-400 bg-gray-50/50 hover:bg-gray-100 transition-colors"
            >
              + {order.items.length - 1} sản phẩm khác
            </button>
          )}
        </div>

        {/* Footer - Tinh gọn tuyệt đối */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-medium text-gray-400">Tổng thanh toán:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {(order.status === "PENDING" || order.status === "AWAITING_PAYMENT") && (
              <button
                onClick={() => onCancelClick(order.id)}
                className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors px-2"
              >
                Hủy đơn
              </button>
            )}
            <button
              onClick={() => navigate(`/orders/${order.id}`)}
              className="px-6 py-2 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold transition-all active:scale-95"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
