const OrderStatusBadge = ({ status }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Chờ xác nhận",
        className: "bg-gray-100 text-gray-700 font-medium",
      },
      PROCESSING: {
        label: "Đang xử lý",
        className: "bg-gray-100 text-gray-700 font-medium",
      },
      SHIPPED: {
        label: "Đang giao",
        className: "bg-gray-100 text-gray-700 font-medium",
      },
      DELIVERED: {
        label: "Đã giao hàng",
        className: "bg-black text-white font-bold",
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-gray-50 text-gray-400 font-normal line-through",
      },
      AWAITING_PAYMENT: {
        label: "Chờ thanh toán",
        className: "bg-gray-200 text-gray-800 font-bold",
      },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  const badge = getStatusBadge(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};

export default OrderStatusBadge;
