import { useState } from 'react';
import { EyeOutlined, SyncOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Empty, Button } from 'antd';
import { formatCurrency, formatDate, statusLabels } from '../../../utils/orderHelpers';

const ORDER_STATUS_STYLES = {
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-700 border-orange-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-violet-100 text-violet-700 border-violet-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
};

const PAYMENT_STATUS_STYLES = {
  SUCCESS: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
  FAILED: 'bg-rose-100 text-rose-700 border-rose-200',
};

const PAYMENT_STATUS_LABELS = {
  SUCCESS: 'Đã TT',
  PENDING: 'Chờ TT',
  FAILED: 'Lỗi',
  CANCELLED: 'Đã hủy',
};

const GRID_CLASS = 'grid grid-cols-[minmax(150px,1.05fr)_minmax(170px,1fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(120px,0.72fr)_56px] items-center gap-3';

const SortLabel = ({ label, field, sortBy, sortDir, onSort, align = 'left' }) => {
  const active = sortBy === field;
  const Icon = active && sortDir === 'desc' ? SortDescendingOutlined : SortAscendingOutlined;

  return (
    <button
      type="button"
      onClick={() => onSort?.(field)}
      className={`inline-flex items-center gap-1 text-[13px] font-semibold text-gray-500 transition hover:text-gray-700 ${align === 'right' ? 'ml-auto justify-end' : ''} ${align === 'center' ? 'mx-auto justify-center' : ''}`}
    >
      <span>{label}</span>
      <Icon className={`text-[10px] ${active ? 'text-gray-700' : 'text-gray-300'}`} />
    </button>
  );
};

const getOrderStatusStyle = (status) => ORDER_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200';
const getPaymentBadgeStyle = (status) => PAYMENT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200';

const getCustomerDisplay = (order) => {
  const name = order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai';
  const contact = order.user?.email || order.guestEmail || order.guestPhone || 'N/A';
  return { name, contact };
};

const getProductDisplay = (order) => ({
  itemCount: order.orderItems?.length || 0,
  firstProduct: order.orderItems?.[0]?.variant?.product?.name || 'N/A',
});

const renderStatusBadge = (status) => (
  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusStyle(status)}`}>
    {statusLabels[status] || status}
  </span>
);

const renderPaymentBadge = (payment) => {
  if (!payment) return <span className="text-sm text-gray-500">Chưa có</span>;

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPaymentBadgeStyle(payment.status)}`}>
        {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
      </span>
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {payment.method === 'CASH' ? 'COD' : payment.method}
      </div>
    </div>
  );
};

const OrderTable = ({
  orders = [],
  loading,
  sortBy,
  sortDir,
  onSort,
  onViewDetails,
  onSyncPayment,
}) => {
  const [syncingPaymentId, setSyncingPaymentId] = useState(null);

  const handleSyncPayment = async (e, paymentId) => {
    e.stopPropagation();
    setSyncingPaymentId(paymentId);
    try {
      await onSyncPayment(paymentId);
    } catch (error) {
      console.error('Sync payment error:', error);
    } finally {
      setSyncingPaymentId(null);
    }
  };

  return (
    <div className={`${loading ? 'opacity-80' : ''}`}>
      <div className={`${GRID_CLASS} border-b border-gray-100 bg-gray-50 px-5 py-4 text-gray-400`}>
        <div className="text-[12px] font-semibold text-gray-400">Mã đơn hàng</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">Khách hàng</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">Sản phẩm</div>
        <SortLabel label="Tổng tiền" field="total" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">Thanh toán</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">Trạng thái</div>
        <SortLabel label="Ngày đặt" field="createdAt" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
        <div />
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Empty description="Không tìm thấy đơn hàng phù hợp" />
        </div>
      ) : (
        orders.map((order) => {
          const { name, contact } = getCustomerDisplay(order);
          const { itemCount, firstProduct } = getProductDisplay(order);
          const discountText = order.discount ? `-${formatCurrency(order.discount)}` : '';

          return (
            <div
              key={order.id}
              className={`${GRID_CLASS} border-b border-gray-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-gray-50`}
            >
              <button
                onClick={() => onViewDetails(order)}
                className="text-left text-[13px] font-semibold text-blue-600 hover:underline"
              >
                {order.orderCode || `#${order.id}`}
              </button>

              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-gray-900">{name}</div>
                <div className="mt-1 text-[12px] text-gray-500">{contact}</div>
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-medium text-gray-700">{itemCount} sản phẩm</div>
                <div className="mt-1 truncate text-[12px] text-gray-400">{firstProduct}</div>
              </div>

              <div className="justify-self-start text-left">
                <div className="text-[13px] font-semibold text-gray-900">{formatCurrency(order.total)}</div>
                {discountText && <div className="mt-1 text-[12px] font-medium text-emerald-600">{discountText}</div>}
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <div className="flex flex-col gap-1.5">
                  {renderPaymentBadge(order.payment)}
                </div>
                {order.payment?.status === 'PENDING' && order.payment?.method === 'PAYOS' && (
                  <Button
                    type="text"
                    size="small"
                    icon={<SyncOutlined spin={syncingPaymentId === order.payment.id} />}
                    onClick={(e) => handleSyncPayment(e, order.payment.id)}
                    disabled={syncingPaymentId === order.payment.id}
                    className="h-8 p-0 text-gray-500 hover:text-gray-700"
                  />
                )}
              </div>

              <div className="min-w-0">{renderStatusBadge(order.status)}</div>

              <div className="justify-self-start text-left text-[13px] text-gray-500">{formatDate(order.createdAt)}</div>

              <div className="flex justify-center">
                <button
                  onClick={() => onViewDetails(order)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
                  aria-label="Xem chi tiết"
                >
                  <EyeOutlined />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderTable;
