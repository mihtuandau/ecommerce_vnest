import { Eye, ChevronUp, ChevronDown, Package } from 'lucide-react';
import Badge from '../../common/Badge';
import { formatCurrency, formatDate, statusVariants, statusLabels } from '../../../utils/orderHelpers';

const OrderTable = ({ orders, loading, sortBy, sortDir, onSort, onViewDetails }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-700 font-medium">Không tìm thấy đơn hàng phù hợp</p>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="inline-flex items-center gap-1 hover:text-gray-700"
                  onClick={() => onSort('total')}
                >
                  Tổng tiền
                  {sortBy === 'total' && (
                    sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="inline-flex items-center gap-1 hover:text-gray-700"
                  onClick={() => onSort('createdAt')}
                >
                  Ngày đặt
                  {sortBy === 'createdAt' && (
                    sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order, idx) => (
              <tr 
                key={order.id} 
                className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50 transition-colors' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.orderCode || `#${order.id}`}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariants[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="p-2 hover:bg-indigo-100 rounded-lg transition-colors inline-flex"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4 text-indigo-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
