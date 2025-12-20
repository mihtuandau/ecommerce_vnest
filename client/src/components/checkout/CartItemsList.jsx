import { formatPrice } from "../../utils/formatters";

const CartItemsList = ({ cartItems }) => {
  return (
    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
      {cartItems.map((item) => {
        // Handle both cart items from Redux and direct product data from ProductDetailPage
        const price = item.product?.variant?.price || item.price || 0;
        const size = item.product?.variant?.size || item.size;
        const color = item.product?.variant?.color || item.color;
        const productName = item.product?.name || item.name || "Sản phẩm";
        const image = item.product?.image || item.image || "/placeholder-product.jpg";

        return (
          <div
            key={item.variantId || item.id}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src={image}
                alt={productName}
                className="w-full h-full object-cover"
              />
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
                <span className="text-sm text-gray-900">
                  {formatPrice(price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsList;
