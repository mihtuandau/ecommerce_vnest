import Modal from '../../common/Modal';
import Badge from '../../common/Badge';
import { formatDateTime, formatDate } from '../../../utils/formatters';
import {
  formatDateShort,
  getStatusVariant,
  getStatusText,
  getDiscountTypeText,
} from '../../../utils/discountHelpers';
import { Calendar, Tag, TrendingUp, Clock } from 'lucide-react';

const DiscountDetailModal = ({ isOpen, onClose, discount }) => {
  if (!discount) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết mã giảm giá">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{discount.code}</h3>
            <p className="text-sm text-gray-500 mt-1">ID: {discount.id}</p>
          </div>
          <Badge variant={getStatusVariant(discount.status)}>
            {getStatusText(discount.status)}
          </Badge>
        </div>

        {/* Mô tả */}
        {discount.description && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <p className="text-gray-900">{discount.description}</p>
          </div>
        )}

        {/* Thông tin giảm giá */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-gray-900" />
              <span className="text-sm font-medium text-gray-700">Giá trị giảm</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {getDiscountTypeText(discount)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {discount.percentage ? 'Giảm theo phần trăm' : 'Giảm số tiền cố định'}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Lượt sử dụng</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {discount.usageCount || 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Tổng số đơn hàng đã dùng</p>
          </div>
        </div>

        {/* Thời gian */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="inline h-4 w-4 mr-1" />
            Thời gian hiệu lực
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Bắt đầu:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(discount.startDate)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Kết thúc:</span>
              <span className="text-sm font-medium text-gray-900">
                {discount.endDate ? formatDate(discount.endDate) : 'Không giới hạn'}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Tạo lúc: {formatDate(discount.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Cập nhật: {formatDate(discount.updatedAt)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DiscountDetailModal;

