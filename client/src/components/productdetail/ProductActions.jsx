import { FaShoppingCart } from "react-icons/fa";
import Button from "../common/Button";

const ProductActions = ({ onAddToCart, totalStock }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12 pb-12 border-b border-gray-100">
      <button
        onClick={() => onAddToCart(false)}
        disabled={totalStock === 0}
        className="h-12 px-6 border border-[#00a85a] text-[#00a85a] hover:bg-[#00a85a] hover:text-white text-sm font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
      >
        <FaShoppingCart className="mr-2 w-4 h-4" />
        Thêm vào giỏ hàng
      </button>
      <button
        onClick={() => onAddToCart(true)}
        disabled={totalStock === 0}
        className="h-12 px-6 bg-[#00a85a] text-white hover:bg-[#008f4d] text-sm font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Mua ngay
      </button>
    </div>
  );
};

export default ProductActions;
