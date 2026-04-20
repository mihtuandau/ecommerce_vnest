import { Empty } from "antd";
import { FaClock, FaEye, FaArrowRight } from "react-icons/fa";
import { formatCurrency, statusLabels } from "../../../utils/orderHelpers";

const ORDER_STATUS_STYLES = {
  AWAITING_PAYMENT: "bg-slate-50 text-slate-500 border-slate-100",
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
  SHIPPED: "bg-indigo-50 text-indigo-600 border-indigo-100",
  DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  CANCELLED: "bg-gray-50 text-gray-400 border-gray-100",
};

const PAYMENT_STATUS_STYLES = {
  SUCCESS: "text-emerald-600 bg-emerald-50 border-emerald-100",
  PENDING: "text-amber-600 bg-amber-50 border-amber-100",
  FAILED: "text-rose-600 bg-rose-50 border-rose-100",
  CANCELLED: "text-gray-400 bg-gray-50 border-gray-100",
};

const PAYMENT_METHOD_LABELS = {
  VNPAY: "VNPay",
  PAYOS: "PayOS",
  MOMO: "MoMo",
  CASH: "COD",
};

const OrderTable = ({
  orders,
  loading,
  startIndex = 1,
  sortBy,
  sortDir,
  onSort,
  onViewDetails,
}) => {
  const renderStatusBadge = (status) => (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${ORDER_STATUS_STYLES[status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
      {statusLabels[status] || status}
    </span>
  );

  const renderPaymentBadge = (order) => {
    const status = order.paymentStatus || order.payment?.status || 'PENDING';
    const method = order.paymentMethod || order.payment?.method || 'CASH';
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
          <span className="text-[11px] font-semibold text-gray-700">{PAYMENT_METHOD_LABELS[method] || method}</span>
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm w-fit border ${PAYMENT_STATUS_STYLES[status] || "bg-gray-50 text-gray-400 border-gray-100"}`}>
          {status === 'SUCCESS' ? 'ĐÃ TT' : (status === 'FAILED' ? 'THẤT BẠI' : 'CHỜ TT')}
        </span>
      </div>
    );
  };

  return (
    <div className={`overflow-x-auto ${loading ? "opacity-60 pointer-events-none" : ""} transition-opacity duration-300`}>
      <table className="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest w-16">STT</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort?.('orderCode')}>Đơn hàng</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest">Khách hàng</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort?.('total')}>Tổng tiền</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest">Thanh toán</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest">Giao nhận</th>
            <th className="py-4 px-4 text-left text-[10px] font-semibold text-slate-800 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort?.('createdAt')}>Thời gian</th>
            <th className="py-4 px-4 text-center text-[10px] font-semibold text-slate-800 uppercase tracking-widest w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-20 text-center">
                <Empty description="Không có đơn hàng nào" />
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order.id} className="group hover:bg-neutral-50/50 transition-all duration-200">
                <td className="py-5 px-4 text-xs font-semibold text-gray-500">
                  {String(startIndex + index).padStart(2, '0')}
                </td>
                
                <td className="py-5 px-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onViewDetails(order)}>
                      {order.orderCode || `#${order.id}`}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                      {order.orderItems?.length || 0} sản phẩm
                    </span>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-slate-800 leading-none">
                      {order.shippingSnapshot?.fullName || order.user?.name || 'Khách vãng lai'}
                    </span>
                    <span className="mt-1.5 text-[10px] text-gray-500 font-semibold tracking-tight">
                      {order.shippingSnapshot?.phone || order.user?.phone || order.guestPhone || '--'}
                    </span>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-slate-800 tracking-tighter">
                      {formatCurrency(order.total)}
                    </span>
                    {order.discountAmount > 0 && (
                      <span className="text-[9px] text-emerald-700 font-semibold uppercase tracking-tighter">
                        -{formatCurrency(order.discountAmount)}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-5 px-4">
                  {renderPaymentBadge(order)}
                </td>

                <td className="py-5 px-4">
                  {renderStatusBadge(order.status)}
                </td>

                <td className="py-5 px-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                      <FaClock size={9} className="text-gray-400" />
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>

                <td className="py-5 px-4 text-center">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    title="Xem chi tiết"
                  >
                    <FaEye size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
