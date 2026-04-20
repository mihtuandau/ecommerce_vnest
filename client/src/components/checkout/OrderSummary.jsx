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
    <div className="bg-white border border-gray-100 p-4 sm:p-6 sticky top-4 mb-8 lg:mb-0">
      <div className="mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800">Tóm tắt đơn hàng</h2>
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
            className="mt-0.5 w-4 h-4 border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm text-gray-600">
            Tôi đã đọc và đồng ý với{' '}
            <a href="#" className="text-black hover:underline">
              Điều khoản dịch vụ
            </a>
          </span>
        </label>
      </div>

      <button
        onClick={onSubmitOrder}
        disabled={submitting || !agreedToTerms}
        className="w-full mt-6 bg-black hover:bg-neutral-800 text-white h-14 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-inter">Đang xử lý...</span>
          </>
        ) : (
          <>
            <FaCheck size={14} />
            <span className="font-inter">Đặt hàng ({formatPrice(total)})</span>
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





