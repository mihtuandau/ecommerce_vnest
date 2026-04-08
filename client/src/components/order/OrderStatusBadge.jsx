const OrderStatusBadge = ({ status }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
      PROCESSING: { label: 'Đang xử lý', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
      SHIPPED: { label: 'Đang giao', className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' },
      DELIVERED: { label: 'Đã giao hàng', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
      CANCELLED: { label: 'Đã hủy', className: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
      AWAITING_PAYMENT: { label: 'Chờ thanh toán', className: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  const badge = getStatusBadge(status);

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
};

export default OrderStatusBadge;
