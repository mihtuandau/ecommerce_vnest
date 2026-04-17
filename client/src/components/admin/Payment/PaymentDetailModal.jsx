import React from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Modal from '../../common/Modal';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import {
  formatCurrency,
  formatDate,
  getStatusVariant,
  getStatusText,
  getMethodText,
} from '../../../utils/paymentHelpers';

const PaymentDetailModal = ({
  payment,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết thanh toán" size="lg" variant="admin">
      <div className="space-y-6">
        {}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">ID Giao dịch</label>
            <p className="mt-1 text-sm text-gray-900">#{payment.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mã đơn hàng</label>
            <p className="mt-1 text-sm text-gray-900">#{payment.orderId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Số tiền</label>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {formatCurrency(payment.amount)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phương thức</label>
            <p className="mt-1">
              <Badge variant="info">{getMethodText(payment.method)}</Badge>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
            <p className="mt-1">
              <Badge variant={getStatusVariant(payment.status)}>
                {getStatusText(payment.status)}
              </Badge>
            </p>
          </div>
          {payment.transactionId && (
            <div>
              <label className="text-sm font-medium text-gray-700">Mã giao dịch</label>
              <p className="mt-1 text-sm text-gray-900">{payment.transactionId}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Thời gian tạo</label>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(payment.createdAt)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(payment.updatedAt)}
            </p>
          </div>
        </div>

        {}
        {payment.order && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tên khách hàng</label>
                <p className="mt-1 text-sm text-gray-900">
                  {payment.order.user ? payment.order.user.name : (payment.order.shippingInfo?.fullName || 'Khách vãng lai')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email / Số điện thoại</label>
                <p className="mt-1 text-sm text-gray-900">
                  {payment.order.user ? payment.order.user.email : (payment.order.guestEmail || payment.order.guestPhone || 'N/A')}
                </p>
              </div>
            </div>
          </div>
        )}

        {}
        {payment.status === 'PENDING' && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cập nhật trạng thái</h3>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => onUpdateStatus(payment.id, 'SUCCESS')}
                icon={CheckCircle}
              >
                Xác nhận thành công
              </Button>
              <Button
                variant="danger"
                onClick={() => onUpdateStatus(payment.id, 'FAILED')}
                icon={XCircle}
              >
                Đánh dấu thất bại
              </Button>
            </div>
          </div>
        )}

        {payment.status === 'SUCCESS' && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hoàn tiền</h3>
            <Button
              variant="warning"
              onClick={() => onUpdateStatus(payment.id, 'REFUNDED')}
              icon={RefreshCw}
            >
              Hoàn tiền
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentDetailModal;






