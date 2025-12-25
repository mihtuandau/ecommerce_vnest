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
          <div className="text-sm font-light text-gray-600 mb-4">
            Màu sắc:{" "}
            <span className="font-normal text-gray-900">
              {selectedColor || "Chọn màu"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`px-5 py-2.5 border font-light capitalize transition-colors ${
                  selectedColor === color
                    ? "border-[#00a85a] bg-[#00a85a] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#00a85a]"
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
          <div className="text-sm font-light text-gray-600 mb-4">
            Kích thước:{" "}
            <span className="font-normal text-gray-900">
              {selectedSize || "Chọn kích thước"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`w-14 h-11 border font-light transition-colors ${
                  selectedSize === size
                    ? "border-[#00a85a] bg-[#00a85a] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#00a85a]"
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