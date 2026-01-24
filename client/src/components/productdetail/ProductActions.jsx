import { FaShoppingCart } from "react-icons/fa";

const ProductActions = ({ onAddToCart, totalStock }) => {
  const isOutOfStock = totalStock === 0;
  
  return (
    <div className="flex gap-4 mb-12 pb-12 border-b border-gray-100">
      <button
        onClick={() => onAddToCart(false)}
        disabled={isOutOfStock}
        className={`flex-1 h-12 border border-[#1a1a1a] text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] ${
          isOutOfStock
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-[#1a1a1a] hover:bg-gray-50'
        }`}
        title={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ hàng'}
        aria-label={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ hàng'}
      >
        <FaShoppingCart className="w-4 h-4" />
        <span>{isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}</span>
      </button>
      <button
        onClick={() => onAddToCart(true)}
        disabled={isOutOfStock}
        className={`flex-1 h-12 text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
        }`}
        title={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Mua ngay'}
        aria-label={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Mua ngay'}
      >
        {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
      </button>
    </div>
  );
};

export default ProductActions;
