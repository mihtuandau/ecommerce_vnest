const ProductQuantity = ({ quantity, onQuantityChange, totalStock }) => {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <span className="text-sm font-light text-gray-600">Số lượng</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 overflow-hidden">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || totalStock === 0}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-lg font-light transition-colors"
          >
            −
          </button>
          <input
            type="text"
            value={quantity}
            onChange={(e) =>
              onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 h-11 text-center font-normal text-gray-900 focus:outline-none bg-white border-l border-r border-gray-200"
            disabled={totalStock === 0}
          />
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={totalStock === 0}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-lg font-light transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductQuantity;
