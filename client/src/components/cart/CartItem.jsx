import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { Zap } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { computeDiscountFromMap } from '../../utils/formatters';

const CartItem = ({ groupedProduct, selectedItems, onToggleItem, onUpdateQuantity, onRemove, onRemoveAll, formatPrice, discountMap }) => {
  const { productId, productName, productImage, variants, totalQuantity, totalPrice, hasFlashSale } = groupedProduct;

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
      variants.forEach(v => {
        if (selectedItems.has(v.variantId)) {
          onToggleItem(v.variantId);
        }
      });
    } else {
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
    <div className="bg-white border border-gray-100 p-3 sm:p-4 transition-all mb-2 sm:mb-3 last:mb-0 rounded-sm">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex-shrink-0 flex items-start pt-1">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={allVariantsSelected}
            onChange={handleToggleAllVariants}
            className="w-4 h-4 border-gray-200 text-slate-800 focus:ring-slate-800 cursor-pointer rounded-sm"
          />
        </div>
        
        <Link
          to={`/products/${groupedProduct.slug || productId}`}
          className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 overflow-hidden rounded-sm border border-gray-50"
        >
          <img
            src={productImage || '/placeholder.jpg'}
            alt={productName || 'Product'}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Link
              to={`/products/${groupedProduct.slug || productId}`}
              className="font-semibold text-[14px] sm:text-[15px] text-slate-800 hover:text-slate-800 line-clamp-2 leading-tight"
            >
              {productName}
            </Link>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                  onRemoveAll(variants.map(v => v.variantId));
                }
              }}
              className="text-gray-300 hover:text-red-500 ml-2"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="mt-4 space-y-6">
            {variants.map((variant) => (
              <div key={`variant-${variant.variantId}`} className="group/item">
                {/* Variant Info Line */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(variant.variantId)}
                    onChange={() => onToggleItem(variant.variantId)}
                    className="w-4 h-4 border-gray-200 text-slate-800 focus:ring-slate-800 cursor-pointer rounded-sm"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {variant.size && (
                      <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-semibold text-gray-400 border border-gray-100 uppercase tracking-tighter">
                        {variant.size}
                      </span>
                    )}
                    {variant.color && (
                      <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-semibold text-gray-400 border border-gray-100 uppercase tracking-tighter">
                        {variant.color}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Quantity Control Line */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    {(() => {
                      const originalPrice = variant.price;
                      const flashPrice = computeDiscountFromMap(productId, originalPrice, discountMap);
                      const hasDiscount = flashPrice !== originalPrice;
                      return (
                        <>
                          <span className={`text-[15px] sm:text-[17px] font-semibold font-inter ${hasDiscount ? 'text-red-600' : 'text-slate-800'}`}>
                            {formatPrice((hasDiscount ? flashPrice : originalPrice) * variant.quantity)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-gray-300 line-through font-inter">
                              {formatPrice(originalPrice * variant.quantity)}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-100 rounded-sm">
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, -1)}
                        disabled={variant.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                      >
                        <FaMinus size={9} />
                      </button>
                      <span className="w-10 text-center text-[12px] font-semibold">{variant.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, 1)}
                        disabled={variant.quantity >= (variant.stock || 999)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                      >
                        <FaPlus size={9} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;





