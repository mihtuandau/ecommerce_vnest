import { useState } from 'react';
import { Clock, RefreshCw, Truck, CheckCircle } from 'lucide-react';
import Modal from '../../common/Modal';
import Select from '../../common/Select';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';
import { statusLabels } from '../../../utils/orderHelpers';

const OrderDetailModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onUpdateStatus, 
  updatingStatus 
}) => {
  const [syncingPayment, setSyncingPayment] = useState(false);

  if (!order) return null;

  const handleSyncPayment = async () => {
    if (!order.payment?.id) return;
    
    try {
      setSyncingPayment(true);
      const result = await paymentService.syncPaymentStatus(order.payment.id);
      notify.success(result.message || 'Đồng bộ thành công!');
      window.location.reload();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể đồng bộ');
    } finally {
      setSyncingPayment(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      SUCCESS: 'bg-gray-100 text-gray-800 border border-gray-300',
      PENDING: 'bg-gray-200 text-gray-800 border border-gray-400',
      FAILED: 'bg-gray-300 text-gray-900 border border-gray-500',
      CANCELLED: 'bg-gray-100 text-gray-700 border border-gray-300'
    };
    const labels = {
      SUCCESS: 'Đã thanh toán',
      PENDING: 'Chờ thanh toán',
      FAILED: 'Thất bại',
      CANCELLED: 'Đã hủy'
    };
    return { styles: styles[status] || 'bg-gray-100 text-gray-800', label: labels[status] || status };
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Tiền mặt (COD)',
      PAYOS: 'PayOS',
      VNPAY: 'VNPay',
      MOMO: 'MoMo'
    };
    return methods[method] || method;
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPED', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' }
  ];

  const paymentStatusBadge = getPaymentStatusBadge(order.payment?.status);
  const subtotal = order.total - (order.taxAmount || 0) - (order.shippingFee || 0);

  const steps = [
    { key: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
    { key: 'PROCESSING', label: 'Đang xử lý', icon: RefreshCw },
    { key: 'SHIPPED', label: 'Đang giao', icon: Truck },
    { key: 'DELIVERED', label: 'Đã giao', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === order.status);

  const nextStatus = {
    PENDING: 'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED: 'DELIVERED',
  };

  const nextButtonLabel = {
    PENDING: 'Xác nhận đơn',
    PROCESSING: 'Giao hàng',
    SHIPPED: 'Hoàn tất',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      size="xl"
      variant="admin"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{order.orderCode || `#${order.id}`}</h2>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {order.status === 'CANCELLED' ? 'Đã hủy' : order.status === 'DELIVERED' ? 'Đã giao' : statusLabels[order.status] || order.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <button
                onClick={() => onUpdateStatus(order.id, nextStatus[order.status])}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-sky-500 transition"
              >
                {nextButtonLabel[order.status] || 'Cập nhật'}</button>
            )}
            {order.status !== 'CANCELLED' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index <= currentStepIndex;
              return (
                <div key={step.key} className="flex items-center gap-2.5">
                  <div className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${active ? 'border-sky-600 bg-sky-600 text-white shadow-lg' : 'border-slate-300 bg-white text-slate-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                    {index < steps.length - 1 && <div className={`mt-1.5 h-0.5 w-full ${active ? 'bg-sky-600' : 'bg-slate-300'}`} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Sản phẩm đặt hàng</h3>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-slate-400">
                      📦
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.variant?.product?.name || 'N/A'}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded-full">Size: {item.variant?.options?.find((o) => o.name.toLowerCase().includes('size'))?.value || 'M'}</span>
                        <span className="px-2 py-1 bg-slate-100 rounded-full">Số lượng: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(item.price)} / 1</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Thuế</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                <div className="mt-4 flex justify-between items-center text-base font-semibold text-slate-900">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Khách hàng</h3>
              <p className="text-sm font-semibold text-slate-900">{order.shippingSnapshot?.fullName || order.user?.name || 'Khách vãng lai'}</p>
              <p className="text-sm text-slate-500">{order.user?.email || order.guestEmail || 'N/A'}</p>
              {(order.user?.phone || order.guestPhone) && (
                <p className="text-sm text-slate-500">{order.user?.phone || order.guestPhone}</p>
              )}
              <a href="#" className="text-sky-600 text-sm font-semibold hover:underline">Xem hồ sơ khách hàng →</a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Địa chỉ giao hàng</h3>
              <p className="text-sm text-slate-500">
                {order.shippingSnapshot?.addressString || (order.address ? `${order.address.street}, ${order.address.city}` : 'N/A')}
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{order.shippingSnapshot?.fullName || order.user?.name || 'Khách vãng lai'}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Thanh toán</h3>
              <p className="text-sm text-slate-500 mb-2">Phương thức</p>
              <p className="font-semibold text-slate-900 mb-4">{getPaymentMethodText(order.payment?.method)}</p>
              <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusBadge.styles}`}>
                {paymentStatusBadge.label}
              </span>
              {order.payment?.status === 'PENDING' && order.payment?.method === 'PAYOS' && (
                <button
                  onClick={handleSyncPayment}
                  disabled={syncingPayment}
                  className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition"
                >
                  {syncingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;