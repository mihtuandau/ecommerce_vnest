import { formatPrice } from '../../utils/formatters';

const CartItemsList = ({ cartItems }) => {
  return (
    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
      {cartItems.map((item) => {
        const price = item.product?.variant?.price || 0;
        const size = item.product?.variant?.size;
        const color = item.product?.variant?.color;
        const productName = item.product?.name || 'Sản phẩm';
        const image = item.product?.image || '/placeholder-product.jpg';
        
        return (
          <div key={item.variantId} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={image}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {productName}
              </h3>
              <p className="text-xs text-gray-500">
                {size && `Size: ${size}`}
                {size && color && ' • '}
                {color && `Màu: ${color}`}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">x{item.quantity}</span>
                <span className="text-sm font-semibold text-gray-900">
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