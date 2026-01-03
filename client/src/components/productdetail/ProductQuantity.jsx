const ProductQuantity = ({ quantity, onQuantityChange, totalStock }) => {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Số lượng</span>
      </div>

      <div className="flex items-center">
        <div className="inline-flex items-center border border-gray-200">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || totalStock === 0}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 hover:opacity-80 disabled:opacity-30 text-lg text-gray-600 transition-colors"
          >
            −
          </button>
          <input
            type="text"
            value={quantity}
            onChange={(e) =>
              onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-14 h-12 text-center text-sm text-gray-900 focus:outline-none bg-white border-l border-r border-gray-200"
            disabled={totalStock === 0}
          />
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={totalStock === 0}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 hover:opacity-80 disabled:opacity-30 text-lg text-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductQuantity;
