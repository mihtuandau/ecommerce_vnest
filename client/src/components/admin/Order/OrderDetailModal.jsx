import { useState } from 'react';
import Modal from '../../common/Modal';
import Select from '../../common/Select';
import paymentService from '../../../services/paymentService';
import { notify } from '../../../utils/notification';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đơn hàng ${order.orderCode || `#${order.id}`}`}
      size="lg"
    >
      <div className="grid grid-cols-2 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Customer */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Khách hàng</h4>
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Tên</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.user?.name || order.shippingInfo?.fullName || 'Khách vãng lai'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Email / SĐT</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}
                  </p>
                </div>
                {order.address && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Địa chỉ</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.address.street}, {order.address.city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Sản phẩm ({order.orderItems?.length || 0})
            </h4>
            <div className="bg-white border border-gray-200">
              <div className="max-h-48 overflow-y-auto">
                {order.orderItems?.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.variant?.product?.name || 'N/A'}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Total */}
          <div className="bg-[#00a85a] text-white p-6 border border-black">
            <p className="text-xs font-medium text-gray-400 mb-2">TỔNG ĐƠN HÀNG</p>
            <p className="text-3xl font-bold mb-6">{formatCurrency(order.total)}</p>
            
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Tạm tính</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {order.shippingFee > 0 && (
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Vận chuyển</span>
                  <span className="font-semibold">{formatCurrency(order.shippingFee)}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Thuế</span>
                  <span className="font-semibold">{formatCurrency(order.taxAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          {order.payment && (
            <div className="bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Thanh toán</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getPaymentMethodText(order.payment.method)}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 ${paymentStatusBadge.styles}`}>
                  {paymentStatusBadge.label}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600 font-medium">Số tiền</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(order.payment.amount)}</span>
                </div>

                {order.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600 font-medium">Thời gian</span>
                    <span className="text-xs text-gray-700">
                      {new Date(order.payment.paidAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}

                {order.payment.status === 'PENDING' && order.payment.method === 'PAYOS' && (
                  <button
                    onClick={handleSyncPayment}
                    disabled={syncingPayment}
                    className="w-full mt-3 bg-[#00a85a] hover:bg-[#008f4d] disabled:bg-gray-600 text-white py-2.5 px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed border border-black"
                  >
                    {syncingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status */}
          {order.status !== 'CANCELLED' && (
            <div className="bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Cập nhật trạng thái
              </p>
              <Select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                options={statusOptions}
                disabled={updatingStatus}
                className="w-full text-sm font-medium"
              />
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;