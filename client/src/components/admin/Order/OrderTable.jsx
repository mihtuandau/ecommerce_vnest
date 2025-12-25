import { Eye, Package, RefreshCw } from 'lucide-react';
import Badge from '../../common/Badge';
import Table from '../../common/Table';
import { formatCurrency, formatDate, statusVariants, statusLabels } from '../../../utils/orderHelpers';
import { useState } from 'react';

const OrderTable = ({ orders, loading, sortBy, sortDir, onSort, onViewDetails, onSyncPayment }) => {
  const [syncingPaymentId, setSyncingPaymentId] = useState(null);

  const handleSyncPayment = async (e, paymentId) => {
    e.stopPropagation();
    setSyncingPaymentId(paymentId);
    await onSyncPayment(paymentId);
    setSyncingPaymentId(null);
  };
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>ID</Table.Header>
            <Table.Header>Mã đơn</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Tổng tiền</Table.Header>
            <Table.Header>Thanh toán</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Ngày đặt</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={8} />
        </Table.Body>
      </Table>
    );
  }

  if (orders.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>ID</Table.Header>
            <Table.Header>Mã đơn</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Tổng tiền</Table.Header>
            <Table.Header>Thanh toán</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Ngày đặt</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={Package}>
            <p className="text-gray-700 font-medium">Không tìm thấy đơn hàng phù hợp</p>
            <p className="text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
          </Table.Empty>
        </Table.Body>
      </Table>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>ID</Table.Header>
          <Table.Header>Mã đơn</Table.Header>
          <Table.Header>Khách hàng</Table.Header>
          <Table.Header 
            sortable 
            sorted={sortBy === 'total'}
            sortDir={sortDir}
            onSort={() => onSort('total')}
          >
            Tổng tiền
          </Table.Header>
          <Table.Header>Thanh toán</Table.Header>
          <Table.Header>Trạng thái</Table.Header>
          <Table.Header
            sortable
            sorted={sortBy === 'createdAt'}
            sortDir={sortDir}
            onSort={() => onSort('createdAt')}
          >
            Ngày đặt
          </Table.Header>
          <Table.Header align="right">Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell>
              <span className="text-xs font-mono text-gray-500">
                #{order.id}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">
                {order.orderCode || `#${order.id}`}
              </span>
            </Table.Cell>
            <Table.Cell>
              <div className="text-sm font-medium text-gray-900">
                {order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai'}
              </div>
              <div className="text-xs text-gray-500">
                {order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </Table.Cell>
            <Table.Cell>
              {order.payment ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="text-xs font-medium">
                      {order.payment.method === 'CASH' && '💵 COD'}
                      {order.payment.method === 'PAYOS' && '💳 PayOS'}
                      {order.payment.method === 'VNPAY' && '💳 VNPay'}
                      {order.payment.method === 'MOMO' && '💳 MoMo'}
                    </div>
                    {order.payment.status === 'PENDING' && order.payment.method === 'PAYOS' && (
                      <button
                        onClick={(e) => handleSyncPayment(e, order.payment.id)}
                        disabled={syncingPaymentId === order.payment.id}
                        className="p-1 hover:bg-blue-100 rounded transition-colors disabled:opacity-50"
                        title="Kiểm tra trạng thái thanh toán"
                      >
                        <RefreshCw className={`w-3 h-3 text-[#00a85a] ${syncingPaymentId === order.payment.id ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                  <Badge variant={
                    order.payment.status === 'SUCCESS' ? 'success' 
                    : order.payment.status === 'PENDING' ? 'warning'
                    : order.payment.status === 'CANCELLED' ? 'default'
                    : 'danger'
                  } size="sm">
                    {order.payment.status === 'SUCCESS' && '✓ Đã TT'}
                    {order.payment.status === 'PENDING' && '⏳ Chờ'}
                    {order.payment.status === 'FAILED' && '✗ Lỗi'}
                    {order.payment.status === 'CANCELLED' && '✗ Hủy'}
                  </Badge>
                </div>
              ) : (
                <span className="text-xs text-gray-400">Chưa có</span>
              )}
            </Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariants[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </span>
            </Table.Cell>
            <Table.Cell align="right">
              <button
                onClick={() => onViewDetails(order)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4 text-gray-900" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default OrderTable;
