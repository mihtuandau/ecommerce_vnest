import { ShoppingCart, CreditCard, Heart } from "lucide-react";

const ProductActions = ({ onAddToCart, totalStock, isWishlisted = false, onToggleWishlist }) => {
  const isOutOfStock = totalStock === 0;

  return (
    <div className="flex items-center gap-2.5">
      {/* Add to cart */}
      <button
        onClick={() => onAddToCart(false)}
        disabled={isOutOfStock}
        className={`flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-colors duration-150 active:scale-[0.98] select-none cursor-pointer ${
          isOutOfStock
            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100'
        }`}
      >
        <ShoppingCart size={16} strokeWidth={2} />
        Thêm vào giỏ
      </button>

      {/* Buy now */}
      <button
        onClick={() => onAddToCart(true)}
        disabled={isOutOfStock}
        className={`flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-colors duration-150 active:scale-[0.98] select-none cursor-pointer ${
          isOutOfStock
            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700'
        }`}
      >
        <CreditCard size={16} strokeWidth={2} />
        {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
      </button>

      {/* Wishlist */}
      <button
        onClick={onToggleWishlist}
        className={`w-11 h-11 rounded-lg border-2 shrink-0 flex items-center justify-center transition-colors duration-150 active:scale-90 cursor-pointer ${
          isWishlisted
            ? 'border-rose-400 bg-rose-50 text-rose-500 hover:bg-rose-100'
            : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700'
        }`}
        title={isWishlisted ? 'Bỏ yêu thích' : 'Yêu thích'}
      >
        <Heart size={16} className={isWishlisted ? 'fill-rose-500' : ''} />
      </button>
    </div>
  );
};

export default ProductActions;
