import { formatPrice } from "../../utils/formatters";
import { Zap } from "lucide-react";

const CartItemsList = ({ cartItems, originalCartItems }) => {
  return (
    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
      {cartItems.map((item, idx) => {

        const price = item.product?.variant?.price || item.price || 0;
        const originalPrice =
          item.product?.variant?.originalPrice ||
          originalCartItems?.[idx]?.product?.variant?.price ||
          price;
        const hasFlash = originalPrice > price;
        const size = item.product?.variant?.size || item.size;
        const color = item.product?.variant?.color || item.color;
        const productName = item.product?.name || item.name || "Sản phẩm";
        const image =
          item.product?.image || item.image || "/placeholder-product.jpg";

        return (
          <div
            key={item.variantId || item.id}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden relative">
              <img
                src={image}
                alt={productName}
                className="w-full h-full object-cover"
              />
              {hasFlash && (
                <span className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-semibold px-1 py-0.5 flex items-center gap-0.5">
                  <Zap size={7} className="fill-white" /> SALE
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-normal text-gray-900 line-clamp-2">
                {productName}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {size && size}
                {size && color && " • "}
                {color && color}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">× {item.quantity}</span>
                <div className="text-right">
                  <span
                    className={`text-sm ${hasFlash ? "text-red-500 font-semibold" : "text-gray-900"}`}
                  >
                    {formatPrice(price * item.quantity)}
                  </span>
                  {hasFlash && (
                    <span className="block text-xs text-gray-400 line-through">
                      {formatPrice(originalPrice * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsList;






