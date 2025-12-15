import Modal from '../../common/Modal';
import Select from '../../common/Select';
import { formatCurrency, statusOptions } from '../../../utils/orderHelpers';
import { useState } from 'react';
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
      notify.success(result.message || 'Đồng bộ trạng thái thành công!');
      
      // Reload the order to get updated payment status
      window.location.reload();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể đồng bộ trạng thái thanh toán');
    } finally {
      setSyncingPayment(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi tiết đơn hàng ${order.orderCode || `#${order.id}`}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tên:</span>
              <span className="text-sm font-medium text-gray-900">{order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium text-gray-900">{order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}</span>
            </div>
            {order.address && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Địa chỉ:</span>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {order.address.street}, {order.address.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm</h3>
          <div className="border rounded-lg divide-y">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.variant?.product?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tổng quan</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tạm tính:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total - (order.taxAmount || 0))}
              </span>
            </div>
            {order.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Thuế (10%):</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.taxAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold text-gray-900">Tổng cộng:</span>
              <span className="text-sm font-semibold text-indigo-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {order.payment && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Thông tin thanh toán</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phương thức:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {order.payment.method === 'CASH' && '💵 Tiền mặt (COD)'}
                  {order.payment.method === 'PAYOS' && '💳 PayOS (Chuyển khoản QR)'}
                  {order.payment.method === 'VNPAY' && '💳 VNPay'}
                  {order.payment.method === 'MOMO' && '💳 MoMo'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                <span className={`text-sm font-semibold inline-flex items-center px-2 py-1 rounded-full ${
                  order.payment.status === 'SUCCESS' 
                    ? 'bg-green-100 text-green-800' 
                    : order.payment.status === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.payment.status === 'CANCELLED'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.payment.status === 'SUCCESS' && '✓ Đã thanh toán'}
                  {order.payment.status === 'PENDING' && '⏳ Chờ thanh toán'}
                  {order.payment.status === 'FAILED' && '✗ Thất bại'}
                  {order.payment.status === 'CANCELLED' && '✗ Đã hủy'}
                </span>
              </div>

              {order.payment.method === 'PAYOS' && order.payment.payosOrderCode && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mã giao dịch PayOS:</span>
                  <span className="text-xs font-mono font-semibold text-blue-600">
                    #{order.payment.payosOrderCode}
                  </span>
                </div>
              )}

              {order.payment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-xs font-mono font-semibold text-gray-700">
                    {order.payment.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số tiền:</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(order.payment.amount)}
                </span>
              </div>

              {order.payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thời gian thanh toán:</span>
                  <span className="text-xs text-gray-700">
                    {new Date(order.payment.paidAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Actions */}
            {order.payment.status === 'SUCCESS' && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Đơn hàng đã được thanh toán. Có thể xử lý và giao hàng.
                </p>
              </div>
            )}
            
            {order.payment.status === 'PENDING' && order.payment.method === 'PAYOS' && (
              <div className="mt-3 space-y-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⏳ Chờ khách hàng thanh toán qua PayOS. Link thanh toán đã được gửi.
                  </p>
                </div>
                <button
                  onClick={handleSyncPayment}
                  disabled={syncingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {syncingPayment ? '🔄 Đang kiểm tra...' : '🔄 Kiểm tra trạng thái thanh toán'}
                </button>
              </div>
            )}

            {order.payment.status === 'PENDING' && order.payment.method === 'CASH' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">
                  💵 Thu tiền mặt khi giao hàng (COD).
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Update */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cập nhật trạng thái</h3>
          <div className="flex gap-3">
            <Select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              options={statusOptions.filter(opt => opt.value !== '')}
              className="flex-1"
              disabled={updatingStatus}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
