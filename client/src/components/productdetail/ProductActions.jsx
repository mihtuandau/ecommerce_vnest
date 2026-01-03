import { FaShoppingCart } from "react-icons/fa";

const ProductActions = ({ onAddToCart, totalStock }) => {
  return (
    <div className="flex gap-4 mb-12 pb-12 border-b border-gray-100">
      <button
        onClick={() => onAddToCart(false)}
        disabled={totalStock === 0}
        className="flex-1 h-12 border border-[#1a1a1a] bg-white text-[#1a1a1a] hover:!opacity-70 text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-30 cursor-pointer flex items-center justify-center gap-2"
      >
        <FaShoppingCart className="w-4 h-4" />
        <span>Thêm vào giỏ</span>
      </button>
      <button
        onClick={() => onAddToCart(true)}
        disabled={totalStock === 0}
        className="flex-1 h-12 bg-[#1a1a1a] !text-white hover:!opacity-70 text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-30 cursor-pointer flex items-center justify-center"
      >
        Mua ngay
      </button>
    </div>
  );
};

export default ProductActions;
