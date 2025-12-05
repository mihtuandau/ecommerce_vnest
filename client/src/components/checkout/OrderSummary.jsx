import { FaShoppingBag, FaCheck } from 'react-icons/fa';
import Button from '../../components/common/Button';
import CartItemsList from './CartItemsList';
import DiscountCodeSection from './DiscountCodeSection';
import PriceSummary from './PriceSummary';
import { formatPrice } from '../../utils/formatters';

const OrderSummary = ({
  cartItems,
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
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <FaShoppingBag className="text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Đơn hàng</h2>
      </div>

      {/* Cart Items */}
      <CartItemsList cartItems={cartItems} />

      {/* Discount Code */}
      <DiscountCodeSection
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        appliedDiscount={appliedDiscount}
        checkingDiscount={checkingDiscount}
        onApplyDiscount={onApplyDiscount}
        onRemoveDiscount={onRemoveDiscount}
      />

      {/* Price Summary */}
      <PriceSummary
        itemCount={itemCount}
        subtotal={subtotal}
        shipping={shipping}
        discount={discount}
        total={total}
      />

      {/* Terms Agreement */}
      <div className="mt-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600">
            Tôi đã đọc và đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản dịch vụ
            </a>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmitOrder}
        disabled={submitting}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <FaCheck />
            Đặt hàng ({formatPrice(total)})
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
      </p>
    </div>
  );
};

export default OrderSummary;