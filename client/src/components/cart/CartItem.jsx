import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { Zap } from 'lucide-react';
import { useRef, useEffect } from 'react';

const CartItem = ({ groupedProduct, selectedItems, onToggleItem, onUpdateQuantity, onRemove, onRemoveAll, formatPrice }) => {
  const { productId, productName, productImage, variants, totalQuantity, totalPrice, hasFlashSale } = groupedProduct;
  
  // Refs cho checkbox
  const checkboxRef = useRef(null);
  
  const allVariantsSelected = variants.every(v => selectedItems.has(v.variantId));
  const someVariantsSelected = variants.some(v => selectedItems.has(v.variantId)) && !allVariantsSelected;
 
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someVariantsSelected;
    }
  }, [someVariantsSelected]);
  
  const handleToggleAllVariants = () => {
    if (allVariantsSelected) {
      // Bỏ chọn tất cả variant đang được chọn
      variants.forEach(v => {
        if (selectedItems.has(v.variantId)) {
          onToggleItem(v.variantId);
        }
      });
    } else {
      // Chọn tất cả variant chưa được chọn
      variants.forEach(v => {
        if (!selectedItems.has(v.variantId)) {
          onToggleItem(v.variantId);
        }
      });
    }
  };

  const handleQuantityChange = (variantId, currentQuantity, newValue) => {
    const numValue = parseInt(newValue);
    
    if (isNaN(numValue) || numValue < 1) {
      onUpdateQuantity(variantId, 1, 0);
      return;
    }
    
    // Tìm variant để lấy stock
    const variant = variants.find(v => v.variantId === variantId);
    const maxStock = variant?.stock || 999;
    
    if (numValue > maxStock) {
      onUpdateQuantity(variantId, maxStock, 0);
      return;
    }
    
    onUpdateQuantity(variantId, numValue, 0);
  };

  const handleQuantityBlur = (variantId, e) => {
    const value = e.target.value.trim();
    if (value === '') {
      onUpdateQuantity(variantId, 1, 0);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow mb-4 last:mb-0">
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={allVariantsSelected}
            onChange={handleToggleAllVariants}
            className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
            aria-label={`Chọn tất cả biến thể của ${productName}`}
          />
        </div>
        
        <Link
          to={`/products/${productId}`}
          className="flex-shrink-0 w-20 h-20 bg-gray-100 overflow-hidden relative"
          aria-label={`Xem chi tiết ${productName}`}
        >
          <img
            src={productImage || '/placeholder.jpg'}
            alt={productName || 'Product'}
            className="w-full h-full object-cover hover:opacity-75 transition-opacity"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
              e.target.onerror = null; 
            }}
            loading="lazy"
          />
          {hasFlashSale && (
            <span className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-semibold px-1 py-0.5 flex items-center gap-0.5">
              <Zap size={8} className="fill-white" /> SALE
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3 cursor-pointer">
            <Link
              to={`/products/${productId}`}
              className="font-medium text-sm text-gray-900 hover:text-red-600 transition-colors line-clamp-2 flex-1 mr-3 cur"
            >
              {productName}
            </Link>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa tất cả biến thể của sản phẩm này?')) {
                  onRemoveAll(variants.map(v => v.variantId));
                }
              }}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-900 transition-colors"
              title="Xóa tất cả"
              aria-label="Xóa tất cả biến thể"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Variants List */}
          <div className="space-y-3">
            {variants.map((variant) => (
              <div key={`variant-${variant.variantId}`} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    id={`variant-${variant.variantId}`}
                    checked={selectedItems.has(variant.variantId)}
                    onChange={() => onToggleItem(variant.variantId)}
                    className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                    aria-label={`Chọn ${productName} - ${variant.size || ''} ${variant.color || ''}`}
                  />
                </div>
                
                {/* Variant Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 text-xs mb-2">
                    {variant.size && (
                      <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs">
                        Size: {variant.size}
                      </span>
                    )}
                    {variant.color && (
                      <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs">
                        Màu: {variant.color}
                      </span>
                    )}
                    {variant.stock !== undefined && (
                      <span className={`px-2 py-1 text-xs ${
                        variant.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : variant.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        Còn {variant.stock} sp
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, -1)}
                        disabled={variant.quantity <= 1}
                        className="w-8 h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Giảm số lượng"
                      >
                        <FaMinus size={10} />
                      </button>
                      <input
                        type="number"
                        id={`quantity-${variant.variantId}`}
                        value={variant.quantity}
                        onChange={(e) => handleQuantityChange(variant.variantId, variant.quantity, e.target.value)}
                        onBlur={(e) => handleQuantityBlur(variant.variantId, e)}
                        className="w-12 h-8 text-center text-sm border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        min="1"
                        max={variant.stock || 999}
                        aria-label="Số lượng"
                      />
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, 1)}
                        disabled={variant.quantity >= (variant.stock || 999)}
                        className="w-8 h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Tăng số lượng"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-1">
                      {variant.flashPrice ? (
                        <>
                          <span className="text-base font-bold text-red-500 block">
                            {formatPrice(variant.flashPrice * variant.quantity)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(variant.price * variant.quantity)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-base font-bold text-gray-900 block">
                            {formatPrice(variant.price * variant.quantity)}
                          </span>
                          {variant.quantity > 1 && (
                            <span className="text-xs text-gray-500">
                              {formatPrice(variant.price)} × {variant.quantity}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                          onRemove(variant.variantId);
                        }
                      }}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa biến thể này"
                      aria-label="Xóa biến thể"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng <span className="font-medium text-gray-900">{totalQuantity}</span> sản phẩm
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {variants.length} biến thể
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;