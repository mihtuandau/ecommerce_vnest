import { useMemo } from 'react';
import { Ruler } from 'lucide-react';

const ProductOptions = ({ product, selectedSize, selectedColor, onSizeSelect, onColorSelect }) => {
  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  }, [product?.variants]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.color).filter(Boolean))];
  }, [product?.variants]);

  const availableSizes = useMemo(() => {
    if (!selectedColor || !product?.variants) return sizes;
    return sizes.filter(size =>
      product.variants.some(v => v.size === size && v.color === selectedColor && v.stock > 0)
    );
  }, [selectedColor, product?.variants, sizes]);

  const availableColors = useMemo(() => {
    if (!selectedSize || !product?.variants) return colors;
    return colors.filter(color =>
      product.variants.some(v => v.color === color && v.size === selectedSize && v.stock > 0)
    );
  }, [selectedSize, product?.variants, colors]);

  if (sizes.length === 0 && colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">

      {}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          {}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Chọn kích cỡ</span>
              {selectedSize && (
                <span className="text-xs font-bold text-gray-900">· {selectedSize}</span>
              )}
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
              <Ruler size={12} /> Hướng dẫn chọn size
            </button>
          </div>
          {}
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const isActive = selectedSize === size;
              const isAvailable = availableSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`h-9 min-w-[40px] px-3 rounded-lg text-sm font-semibold border transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : isAvailable
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {}
      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          {}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Màu sắc</span>
            {selectedColor && (
              <span className="text-xs font-bold text-gray-900">· {selectedColor}</span>
            )}
          </div>
          {}
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const isActive = selectedColor === color;
              const isAvailable = availableColors.includes(color);
              const swatch =
                color.toLowerCase() === 'white' ? '#ffffff' :
                color.toLowerCase() === 'black' ? '#111111' : color;
              return (
                <button
                  key={color}
                  onClick={() => onColorSelect(color)}
                  disabled={!isAvailable}
                  className={`h-9 px-3 rounded-lg text-sm font-semibold border transition-all duration-150 flex items-center gap-2 active:scale-95 ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : isAvailable
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: swatch }}
                  />
                  {color}
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





