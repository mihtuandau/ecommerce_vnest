import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xác nhận', className: 'border-yellow-600 text-yellow-700 bg-yellow-50' },
      PROCESSING: { label: 'Đang xử lý', className: 'border-[#00a85a] text-green-700 bg-green-50' },
      SHIPPED: { label: 'Đang giao', className: 'border-purple-600 text-purple-700 bg-purple-50' },
      DELIVERED: { label: 'Đã giao', className: 'border-green-600 text-green-700 bg-green-50' },
      CANCELLED: { label: 'Đã hủy', className: 'border-red-600 text-red-700 bg-red-50' },
      AWAITING_PAYMENT: { label: 'Chờ thanh toán', className: 'border-orange-600 text-orange-700 bg-orange-50' },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  const badge = getStatusBadge(status);

  return (
    <span className={`px-2.5 py-1 border text-xs font-normal ${badge.className}`}>
      {badge.label}
    </span>
  );
};

export default OrderStatusBadge;
