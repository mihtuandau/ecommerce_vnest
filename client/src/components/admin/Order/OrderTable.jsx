import { useState } from 'react';
import { EyeOutlined, SyncOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Empty, Button } from 'antd';
import { formatCurrency, formatDate, statusLabels } from '../../../utils/orderHelpers';

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

  const getOrderStatusStyle = (status) => {
    const styles = {
      AWAITING_PAYMENT: 'bg-orange-100 text-orange-700 border-orange-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      PROCESSING: 'bg-sky-100 text-sky-700 border-sky-200',
      SHIPPED: 'bg-violet-100 text-violet-700 border-violet-200',
      DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPaymentBadgeStyle = (status) => {
    const styles = {
      SUCCESS: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
      FAILED: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const renderStatusBadge = (status) => (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusStyle(status)}`}>
      {statusLabels[status] || status}
    </span>
  );

  const renderPaymentBadge = (payment) => {
    if (!payment) return <span className="text-sm text-slate-500">Chưa có</span>;

    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPaymentBadgeStyle(payment.status)}`}>
          {payment.status === 'SUCCESS' && 'Đã TT'}
          {payment.status === 'PENDING' && 'Chờ TT'}
          {payment.status === 'FAILED' && 'Lỗi'}
          {payment.status === 'CANCELLED' && 'Đã hủy'}
        </span>
        <div className="text-xs uppercase tracking-wide text-slate-400">
          {payment.method === 'CASH' ? 'COD' : payment.method}
        </div>
      </div>
    );
  };

  const SortLabel = ({ label, field, align = 'left' }) => {
    const active = sortBy === field;
    const Icon = active && sortDir === 'desc' ? SortDescendingOutlined : SortAscendingOutlined;

    return (
      <button
        type="button"
        onClick={() => onSort?.(field)}
        className={`inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 transition hover:text-slate-700 ${align === 'right' ? 'ml-auto justify-end' : ''} ${align === 'center' ? 'mx-auto justify-center' : ''}`}
      >
        <span>{label}</span>
        <Icon className={`text-[10px] ${active ? 'text-slate-700' : 'text-slate-300'}`} />
      </button>
    );
  };

  return (
    <div className={`${loading ? 'opacity-80' : ''}`}>
      <div className="grid grid-cols-[minmax(150px,1.05fr)_minmax(170px,1fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(120px,0.72fr)_56px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-400">
        <div className="text-[12px] font-semibold text-slate-400">Mã đơn hàng</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">Khách hàng</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">Sản phẩm</div>
        <SortLabel label="Tổng tiền" field="total" />
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">Thanh toán</div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">Trạng thái</div>
        <SortLabel label="Ngày đặt" field="createdAt" />
        <div />
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Empty description="Không tìm thấy đơn hàng phù hợp" />
        </div>
      ) : (
        orders.map((order) => {
          const itemCount = order.orderItems?.length || 0;
          const firstProduct = order.orderItems?.[0]?.variant?.product?.name || 'N/A';
          const discountText = order.discount ? `-${formatCurrency(order.discount)}` : '';

          return (
            <div
              key={order.id}
              className="grid grid-cols-[minmax(150px,1.05fr)_minmax(170px,1fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(110px,0.82fr)_minmax(110px,0.7fr)_minmax(120px,0.72fr)_56px] items-center gap-3 border-b border-slate-200 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/70"
            >
              <button
                onClick={() => onViewDetails(order)}
                className="text-left text-[13px] font-semibold text-sky-600 hover:underline"
              >
                {order.orderCode || `#${order.id}`}
              </button>

              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-900">
                  {order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai'}
                </div>
                <div className="mt-1 text-[12px] text-slate-500">
                  {order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-medium text-slate-700">{itemCount} sản phẩm</div>
                <div className="mt-1 truncate text-[12px] text-slate-400">{firstProduct}</div>
              </div>

              <div className="justify-self-start text-left">
                <div className="text-[13px] font-semibold text-slate-900">{formatCurrency(order.total)}</div>
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
                    className="h-8 p-0 text-slate-500 hover:text-slate-700"
                  />
                )}
              </div>

              <div className="min-w-0">{renderStatusBadge(order.status)}</div>

              <div className="justify-self-start text-left text-[13px] text-slate-500">{formatDate(order.createdAt)}</div>

              <div className="flex justify-center">
                <button
                  onClick={() => onViewDetails(order)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
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
