import Button from '../common/Button';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Zap } from 'lucide-react';

const CartSummary = ({ total, selectedCount, totalCount, formatPrice, onCheckout, discount = 0, promotionTitle = 'Khuyến mãi' }) => {
  const totalBeforeDiscount = total + discount;
  
  return (
    <div className="bg-white border border-gray-200 sticky top-8 shadow-lg">
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-200">
          Tóm Tắt Đơn Hàng
        </h2>

        {/* Selected Items Count */}
        {selectedCount !== undefined && totalCount !== undefined && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Đã chọn{' '}
              <span className="font-medium text-gray-900">{selectedCount}</span>
              {' '}/ {totalCount} sản phẩm
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="text-gray-900 font-medium">
              {formatPrice(totalBeforeDiscount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="text-gray-900 font-medium">
              Miễn phí
            </span>
          </div>
          
          {/* Discount Display */}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <Zap size={16} className="text-red-600" />
                {promotionTitle}
              </span>
              <span className="text-red-600 font-medium">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-300 pt-6 mt-6">
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">
                Tổng cộng
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0}
          className="w-full bg-[#00a85a] hover:bg-[#008f4d] text-white py-4 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Tiến Hành Thanh Toán
        </Button>
        
        {selectedCount === 0 && (
          <div className="flex items-center gap-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 animate-pulse">
            <FaExclamationCircle className="text-yellow-600 text-xl flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-yellow-800 mb-1">Chưa chọn sản phẩm</p>
              <p className="text-xs text-yellow-700">
                Hãy chọn ít nhất một sản phẩm để tiếp tục thanh toán
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-3 pt-8 border-t border-gray-200">
          <p className="flex items-center gap-3 text-gray-700 font-medium">
            <span className="w-1.5 h-1.5 bg-green-500"></span>
            Miễn phí vận chuyển toàn quốc
          </p>
          <p className="flex items-center gap-3 text-gray-700 font-medium">
            <span className="w-1.5 h-1.5 bg-green-500"></span>
            Đổi trả trong 30 ngày
          </p>
          <p className="flex items-center gap-3 text-gray-700 font-medium">
            <span className="w-1.5 h-1.5 bg-green-500"></span>
            Thanh toán an toàn
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
