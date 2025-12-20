import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaShoppingBag, FaTrash } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatters";

  

const CartDrawer = ({ isOpen, onClose }) => {
  const cartData = useCart();
  const cartItems = cartData?.items || [];
  const cartTotal = cartData?.total || 0;

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

  const getProductImage = (item) => {
    return (
      item.product?.image ||
      item.product?.variant?.product?.images?.[0]?.url ||
      item.product?.images?.[0]?.url
    );
  };

  return (
    <>
      {/* Backdrop with fade animation */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          role="presentation"
        />
      )}

      {/* Modal Dropdown */}
      {isOpen && (
        <div className="fixed top-[64px] right-6 z-[9999]">
          <div className="relative bg-white shadow-2xl w-[420px] max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
            {/* Header with gradient accent */}
            <div className="relative px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 flex items-center justify-center">
                    <FaShoppingBag className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Giỏ Hàng
                    </h2>
                    <p className="text-xs text-gray-500">
                      {cartItems.length} sản phẩm
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  type="button"
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

          {/* Items List with custom scrollbar */}
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0 cart-scrollbar">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.variantId}
                    className="group flex gap-4 pb-4 border-b border-gray-100 last:border-0 cart-item-animate"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image with hover effect - no border radius */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 overflow-hidden ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
                      <img
                        src={getProductImage(item) || "/placeholder.jpg"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 leading-snug">
                          {item.product?.name}
                        </h3>
                        <button
                          onClick={() => {
                            cartData.removeFromCart(item.variantId);
                          }}
                          type="button"
                          className="text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0 cursor-pointer p-2"
                          title="Xóa sản phẩm"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>

                      {/* Size/Color - no border radius */}
                      {(item.product?.variant?.size ||
                        item.product?.variant?.color) && (
                        <div className="flex gap-2 mb-3">
                          {item.product?.variant?.size && (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                              {item.product.variant.size}
                            </span>
                          )}
                          {item.product?.variant?.color && (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                              {item.product.variant.color}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quantity & Price - no border radius */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-gray-900 text-white">
                          x{item.quantity}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {formatPrice(
                            (item.product?.variant?.price || 0) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mb-4">
                  <FaShoppingBag className="text-gray-400 text-3xl" />
                </div>
                <p className="text-gray-900 font-semibold text-base mb-2">
                  Giỏ hàng trống
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Thêm sản phẩm vào giỏ để tiếp tục mua sắm
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </div>

          {/* Footer with enhanced styling */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gradient-to-t from-gray-50 to-white flex-shrink-0">
              {/* Total with better visual hierarchy - no border radius */}
              <div className="flex justify-between items-center p-4 bg-white border border-gray-200">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Tổng tiền
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {cartItems.length} sản phẩm
                  </span>
                </div>
              </div>

              {/* Buttons with improved styling - no border radius */}
              <div className="flex gap-3">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold py-3 transition-all duration-200 cursor-pointer border-2 border-gray-900 hover:border-gray-700"
                >
                  Xem Giỏ Hàng
                </Link>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Thanh Toán
                </Link>
              </div>

              {/* Additional info */}
              <p className="text-center text-xs text-gray-500">
                Miễn phí vận chuyển cho đơn hàng trên 500.000₫
              </p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideInCart {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .cart-item-animate {
          animation: slideInCart 0.3s ease-out forwards;
        }

        .cart-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .cart-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .cart-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }

        .cart-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;