import { FaShoppingBag, FaCheck } from 'react-icons/fa';
import CartItemsList from './CartItemsList';
import DiscountCodeSection from './DiscountCodeSection';
import PriceSummary from './PriceSummary';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';

const OrderSummary = ({
  cartItems,
  originalCartItems,
  flashSaleDiscount,
  subtotal,
  shipping,
  discount,
  total,
  itemCount,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  checkingDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  agreedToTerms,
  setAgreedToTerms,
  submitting,
  onSubmitOrder
}) => {
  return (
    <div className="bg-white border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
        <div className="w-10 h-10 border border-black flex items-center justify-center">
          <FaShoppingBag className="text-gray-900 text-sm" />
        </div>
        <h2 className="text-lg font-normal text-gray-900">Đơn Hàng</h2>
      </div>

      <CartItemsList cartItems={cartItems} originalCartItems={originalCartItems} />

      <DiscountCodeSection
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        appliedDiscount={appliedDiscount}
        checkingDiscount={checkingDiscount}
        onApplyDiscount={onApplyDiscount}
        onRemoveDiscount={onRemoveDiscount}
      />

      <PriceSummary
        itemCount={itemCount}
        subtotal={subtotal}
        shipping={shipping}
        discount={discount}
        flashSaleDiscount={flashSaleDiscount}
        total={total}
      />

      <div className="mt-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 border-gray-300 text-black"
          />
          <span className="text-sm text-gray-600">
            Tôi đã đọc và đồng ý với{' '}
            <a href="#" className="text-gray-900 hover:underline">
              Điều khoản dịch vụ
            </a>
          </span>
        </label>
      </div>

      <button
        onClick={onSubmitOrder}
        disabled={submitting || !agreedToTerms}
        className="w-full mt-6 bg-black hover:bg-neutral-800 text-white py-4 font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <FaCheck size={14} />
            Đặt hàng ({formatPrice(total)})
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
      </p>
    </div>
  );
};

export default OrderSummary;





