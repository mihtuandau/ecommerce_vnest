import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaShoppingBag, FaTag, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useAutoApplyDiscounts } from "../../hooks/useFlashSale";
import { formatPrice, computeDiscountFromMap } from "../../utils/formatters";
import discountService from "../../services/discountService";
import CartDrawerItem from "./CartDrawerItem";

const CartDrawer = ({ isOpen, onClose }) => {
  const cartData = useCart();
  const cartItems = cartData?.items || [];
  const cartTotal = cartData?.total || 0;
  const { discountMap } = useAutoApplyDiscounts();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null); 

  const discountAmount = couponResult?.valid ? (couponResult.discountAmount || 0) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponResult(null);
    try {
      const res = await discountService.validateDiscount(couponCode.trim());
      const discount = res?.discount || res;
      if (res?.isValid || res?.valid) {
        let amount = 0;
        if (discount?.percentage) {
          amount = Math.round(cartTotal * discount.percentage / 100);
        } else if (discount?.fixedAmount) {
          amount = discount.fixedAmount;
        }

        if (discount?.minOrderAmount && cartTotal < discount.minOrderAmount) {
          setCouponResult({
            valid: false,
            message: `Đơn hàng tối thiểu ${formatPrice(discount.minOrderAmount)} để áp dụng mã này`,
          });
        } else {
          setCouponResult({
            valid: true,
            discount,
            discountAmount: amount,
            message: discount?.percentage
              ? `Giảm ${discount.percentage}% (−${formatPrice(amount)})`
              : `Giảm ${formatPrice(amount)}`,
          });
        }
      } else {
        setCouponResult({ valid: false, message: res?.message || "Mã giảm giá không hợp lệ" });
      }
    } catch {
      setCouponResult({ valid: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          role="presentation"
        />
      )}

      {isOpen && (
        <div className="fixed top-[64px] right-6 z-[9999]">
          <div className="relative bg-white shadow-2xl w-[420px] max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
            <div className="relative px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black flex items-center justify-center">
                    <FaShoppingBag className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Giỏ Hàng</h2>
                    <p className="text-xs text-gray-500">{cartItems.length} sản phẩm</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0 cart-scrollbar">
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <CartDrawerItem
                      key={item.variantId}
                      item={item}
                      index={index}
                      discountMap={discountMap}
                      computeDiscountFromMap={computeDiscountFromMap}
                      onRemove={cartData.removeFromCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mb-4">
                    <FaShoppingBag className="text-gray-400 text-3xl" />
                  </div>
                  <p className="text-gray-900 font-semibold text-base mb-2">Giỏ hàng trống</p>
                  <p className="text-gray-500 text-sm mb-6">Thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gradient-to-t from-gray-50 to-white flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaTag className="text-black text-sm flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Mã giảm giá</span>
                  </div>
                  {couponResult?.valid ? (
                    <div className="flex items-center justify-between px-3 py-2.5 bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-green-800">{couponCode.toUpperCase()}</span>
                        <span className="text-xs text-green-600">{couponResult.message}</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-2"
                      >
                        <FaTimesCircle size={15} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Nhập mã giảm giá..."
                          className="flex-1 text-sm border border-gray-200 px-3 py-2 focus:outline-none focus:border-black transition-colors bg-white"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {couponLoading ? "..." : "Áp dụng"}
                        </button>
                      </div>
                      {couponResult?.valid === false && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <FaTimesCircle className="text-red-500 flex-shrink-0 text-xs" />
                          <p className="text-xs text-red-600">{couponResult.message}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center p-4 bg-white border border-gray-200">
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Tổng tiền</span>
                    {discountAmount > 0 && (
                      <span className="block text-sm text-gray-400 line-through mb-0.5">{formatPrice(cartTotal)}</span>
                    )}
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(finalTotal)}</span>
                    {discountAmount > 0 && (
                      <span className="block text-xs text-green-600 font-medium mt-0.5">Tiết kiệm {formatPrice(discountAmount)}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{cartItems.length} sản phẩm</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold py-3 transition-all duration-200 cursor-pointer border-2 border-black hover:border-neutral-800"
                  >
                    Xem Giỏ Hàng
                  </Link>
                  <Link
                    to="/checkout"
                    state={couponResult?.valid ? { couponCode, discountAmount, discountInfo: couponResult.discount } : undefined}
                    onClick={onClose}
                    className="flex-1 text-center bg-black hover:bg-neutral-800 text-white text-sm font-semibold py-3 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl" 
                  >
                    Thanh Toán
                  </Link>
                </div>
                <p className="text-center text-xs text-gray-500">Miễn phí vận chuyển cho đơn hàng trên 500.000₫</p>
              </div>
            )}
          </div>
          <style>{`
            @keyframes slideInCart { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
            .cart-item-animate { animation: slideInCart 0.3s ease-out forwards; }
            .cart-scrollbar::-webkit-scrollbar { width: 6px; }
            .cart-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .cart-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; }
            .cart-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
          `}</style>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
