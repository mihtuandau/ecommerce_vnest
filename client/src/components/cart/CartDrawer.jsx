import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatters";

const Arrow = () => (
  <div className="absolute -top-2 right-8 z-100">
    <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
  </div>
);

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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/20 cursor-pointer"
          onClick={onClose}
          role="presentation"
        />
      )}

      {/* Modal Dropdown - positioned near cart icon */}
      <div
        className={`fixed top-[64px] right-6 z-[9999] transition-all duration-300 ${
          isOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`relative bg-white rounded-lg shadow-2xl w-96 max-h-[70vh] overflow-hidden flex flex-col transform transition-all duration-300 origin-top-right ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {isOpen && <Arrow />}
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Giỏ Hàng
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={getProductImage(item) || "/placeholder.jpg"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                          {item.product?.name}
                        </h3>
                        <button
                          onClick={() => {
                            cartData.removeFromCart(item.variantId);
                          }}
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer p-1"
                          title="Xóa sản phẩm"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>

                      {/* Size/Color */}
                      {(item.product?.variant?.size ||
                        item.product?.variant?.color) && (
                        <p className="text-xs text-gray-500 mb-2">
                          {item.product?.variant?.size && (
                            <span>{item.product.variant.size}</span>
                          )}
                          {item.product?.variant?.color && (
                            <span> • {item.product.variant.color}</span>
                          )}
                        </p>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          x{item.quantity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
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
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-600 text-sm">Giỏ hàng trống</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-3 bg-white flex-shrink-0">
              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-600 uppercase tracking-wide">
                  Tổng tiền:
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded transition-colors cursor-pointer block"
                >
                  Xem Giỏ Hàng
                </Link>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex-1 text-center bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium py-2.5 rounded transition-colors cursor-pointer block"
                >
                  Thanh Toán
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
