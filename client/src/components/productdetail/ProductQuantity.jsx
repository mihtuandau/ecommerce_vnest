import { Minus, Plus } from "lucide-react";

const ProductQuantity = ({ quantity, onQuantityChange, totalStock }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-semibold text-gray-500 shrink-0">Số lượng</span>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || totalStock === 0}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-300"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={totalStock === 0 ? 0 : quantity}
          onChange={e => onQuantityChange(Math.max(1, Math.min(totalStock, parseInt(e.target.value) || 1)))}
          disabled={totalStock === 0}
          className="w-12 h-9 text-center text-sm font-semibold text-gray-900 bg-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onQuantityChange(Math.min(totalStock, quantity + 1))}
          disabled={totalStock === 0 || quantity >= totalStock}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-gray-300"
        >
          <Plus size={14} />
        </button>
      </div>
      {totalStock > 0 && (
        <span className="text-xs text-gray-400">Tối đa {totalStock}</span>
      )}
    </div>
  );
};

export default ProductQuantity;






