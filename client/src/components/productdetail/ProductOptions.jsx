import { useMemo } from 'react';

const normalizeOption = (value) => String(value || '').trim().toLowerCase();

const ProductOptions = ({
  product,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
}) => {
  const getSizes = () => {
    if (!product?.variants) return [];
    const variantsWithStock = product.variants.filter((v) => (v?.stock || 0) > 0);
    return [...new Set(variantsWithStock.map((v) => v.size).filter(Boolean))];
  };

  const getColors = () => {
    if (!product?.variants) return [];
    const variantsWithStock = product.variants.filter((v) => (v?.stock || 0) > 0);
    return [...new Set(variantsWithStock.map((v) => v.color).filter(Boolean))];
  };

  const sizes = useMemo(() => getSizes(), [product?.variants]);
  const colors = useMemo(() => getColors(), [product?.variants]);

  // Get available sizes/colors with stock for the selected color/size
  const getAvailableSizes = () => {
    if (!selectedColor || !product?.variants) return sizes;
    const selectedColorNormalized = normalizeOption(selectedColor);
    return sizes.filter(size =>
      product.variants.some(
        (v) =>
          normalizeOption(v.size) === normalizeOption(size) &&
          normalizeOption(v.color) === selectedColorNormalized &&
          (v.stock || 0) > 0,
      )
    );
  };

  const getAvailableColors = () => {
    if (!selectedSize || !product?.variants) return colors;
    const selectedSizeNormalized = normalizeOption(selectedSize);
    return colors.filter(color =>
      product.variants.some(
        (v) =>
          normalizeOption(v.color) === normalizeOption(color) &&
          normalizeOption(v.size) === selectedSizeNormalized &&
          (v.stock || 0) > 0,
      )
    );
  };

  const availableSizes = useMemo(() => getAvailableSizes(), [selectedColor, product?.variants, sizes]);
  const availableColors = useMemo(() => getAvailableColors(), [selectedSize, product?.variants, colors]);

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
            {colors.map((color) => {
              const isAvailable = availableColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => onColorSelect(color)}
                  disabled={!isAvailable}
                  className={`px-5 py-2.5 text-xs uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] ${
                    selectedColor === color
                      ? "bg-[#1a1a1a] !text-white hover:opacity-80"
                      : isAvailable
                      ? "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:opacity-80"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50"
                  }`}
                  aria-label={`Chọn màu ${color}${!isAvailable ? ' (hết hàng)' : ''}`}
                  title={!isAvailable ? 'Tùy chọn này không có sẵn' : ''}
                >
                  {color}
                </button>
              );
            })}
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
            {sizes.map((size) => {
              const isAvailable = availableSizes.includes(size);
              const getSizeClass = () => {
                if (size.length <= 2) return 'w-12 h-12';
                if (size.length <= 4) return 'w-14 h-14 text-[10px]';
                return 'px-3 h-12 text-[10px] min-w-fit';
              };
              return (
                <button
                  key={size}
                  onClick={() => onSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`${getSizeClass()} text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-[#1a1a1a] !text-white hover:opacity-80"
                      : isAvailable
                      ? "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:opacity-80"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50"
                  }`}
                  aria-label={`Chọn kích thước ${size}${!isAvailable ? ' (hết hàng)' : ''}`}
                  title={!isAvailable ? 'Tùy chọn này không có sẵn' : ''}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductOptions;