const ProductOptions = ({
  product,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
}) => {
  const getSizes = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  };

  const getColors = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  };

  const sizes = getSizes();
  const colors = getColors();

  if (sizes.length === 0 && colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 mb-10 pb-10 border-b border-gray-100">
      {colors.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">
            Màu sắc:{" "}
            <span className="text-gray-900 font-medium">
              {selectedColor || "Chọn màu"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`px-5 py-2.5 text-xs uppercase tracking-wide transition-all duration-200 ${
                  selectedColor === color
                    ? "bg-[#1a1a1a] !text-white hover:opacity-80"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:opacity-80"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">
            Kích thước:{" "}
            <span className="text-gray-900 font-medium">
              {selectedSize || "Chọn kích thước"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`w-12 h-12 text-xs font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-[#1a1a1a] !text-white hover:opacity-80"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:opacity-80"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductOptions;