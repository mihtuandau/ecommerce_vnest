import Modal from '../../common/Modal';
import Select from '../../common/Select';
import { formatCurrency, statusOptions } from '../../../utils/orderHelpers';

const OrderDetailModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onUpdateStatus, 
  updatingStatus 
}) => {
  if (!order) return null;

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
