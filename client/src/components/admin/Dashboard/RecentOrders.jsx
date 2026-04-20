import React from 'react';
import { formatPrice, formatDateTime } from '../../../utils/formatters';
import { Eye } from 'lucide-react';

const RecentOrders = ({ orders }) => {
  const formatCurrency = formatPrice;

  const getOrderStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chờ xử lý', className: 'bg-amber-100 text-amber-700' };
      case 'PROCESSING':
        return { text: 'Đang xử lý', className: 'bg-blue-100 text-blue-700' };
      case 'SHIPPED':
        return { text: 'Đang giao', className: 'bg-purple-100 text-purple-700' };
      case 'DELIVERED':
        return { text: 'Đã giao', className: 'bg-green-100 text-green-700' };
      case 'CANCELLED':
        return { text: 'Đã hủy', className: 'bg-red-100 text-red-700' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Đơn hàng gần đây</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          Xem tất cả &rarr;
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-gray-500 border-b border-gray-100">
              <th className="py-3 px-6 font-medium">Mã đơn</th>
              <th className="py-3 px-6 font-medium">Khách hàng</th>
              <th className="py-3 px-6 font-medium text-right">Tổng tiền</th>
              <th className="py-3 px-6 font-medium text-center">Trạng thái</th>
              <th className="py-3 px-6 font-medium text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => {
                const statusConfig = getOrderStatusConfig(order.status);
                const customerName = order.user ? order.user.name : (order.guestEmail ? 'Guest Order' : 'Khách vãng lai');
                const customerEmail = order.user ? order.user.email : (order.guestEmail || '');

                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                        {order.orderCode || `#${order.id}`}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{customerName}</span>
                        {customerEmail && (
                          <span className="text-xs text-gray-400">{customerEmail}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-gray-800">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${statusConfig.className}`}>
                        {statusConfig.text}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;





