import React from 'react';
import { Clock } from 'lucide-react';
import Badge from '../../common/Badge';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const RecentOrders = ({ orders }) => {
  const formatCurrency = formatPrice;
  const formatDate = formatDateTime;

  const getOrderStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      PROCESSING: 'info',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    return variants[status] || 'default';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Đơn hàng gần đây
          </h2>
        </div>
        {orders.length > 5 && (
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            5/{orders.length}
          </span>
        )}
      </div>

      {/* Scrollable container with fixed height */}
      <div className="overflow-y-auto max-h-[400px] space-y-3 pr-2 custom-scrollbar">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">#{order.id}</span>
                  <Badge variant={getOrderStatusVariant(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{order.user.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {orders.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Xem tất cả {orders.length} đơn hàng →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;