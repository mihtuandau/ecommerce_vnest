import { FaTag, FaCheck, FaTimes } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';

const DiscountCodeSection = ({
  discountCode,
  setDiscountCode,
  appliedDiscount,
  checkingDiscount,
  onApplyDiscount,
  onRemoveDiscount
}) => {
  return (
    <div className="border-t border-gray-200 pt-5 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <FaTag className="text-slate-800 text-sm" />
        <span className="font-semibold text-slate-800">Mã giảm giá</span>
      </div>
      
      {appliedDiscount ? (
        <div className="flex items-center justify-between border border-slate-800 p-3">
          <div className="flex items-center gap-2">
            <FaCheck className="text-slate-800 text-sm" />
            <div>
              <div className="font-semibold text-slate-800">{appliedDiscount.code}</div>
              <div className="text-xs text-gray-600 mt-0.5">
                {appliedDiscount.discountType === 'PERCENTAGE' 
                  ? `Giảm ${appliedDiscount.discountValue}%` 
                  : `Giảm ${formatPrice(appliedDiscount.discountValue)}`}
              </div>
            </div>
          </div>
          <button
            onClick={onRemoveDiscount}
            className="text-gray-600 hover:text-slate-800 p-1 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã giảm giá"
            className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-slate-800 text-sm transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && onApplyDiscount()}
          />
          <button
            onClick={onApplyDiscount}
            disabled={checkingDiscount}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-sm transition-colors disabled:opacity-50"
          >
            {checkingDiscount ? 'Kiểm tra...' : 'Áp dụng'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeSection;





