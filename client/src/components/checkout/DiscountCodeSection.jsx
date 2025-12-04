import { FaTag, FaCheck, FaTimes } from 'react-icons/fa';
import Button from '../../components/common/Button';
import { formatPrice } from '../../utils/formatters';

const DiscountCodeSection = ({
  discountCode,
  setDiscountCode,
  appliedDiscount,
  checkingDiscount,
  onApplyDiscount,
  onRemoveDiscount
}) => {
  return (
    <div className="border-t pt-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FaTag className="text-green-600" />
        <span className="font-medium text-gray-900">Mã giảm giá</span>
      </div>
      
      {appliedDiscount ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <FaCheck className="text-green-600" />
            <div>
              <div className="font-medium text-green-900">{appliedDiscount.code}</div>
              <div className="text-xs text-green-700">
                {appliedDiscount.discountType === 'PERCENTAGE' 
                  ? `Giảm ${appliedDiscount.discountValue}%` 
                  : `Giảm ${formatPrice(appliedDiscount.discountValue)}`}
              </div>
            </div>
          </div>
          <button
            onClick={onRemoveDiscount}
            className="text-red-600 hover:text-red-700 p-1"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã giảm giá"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === 'Enter' && onApplyDiscount()}
          />
          <Button
            onClick={onApplyDiscount}
            disabled={checkingDiscount}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            {checkingDiscount ? 'Kiểm tra...' : 'Áp dụng'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeSection;