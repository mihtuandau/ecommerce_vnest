import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';


const CartItem = ({ groupedProduct, selectedItems, onToggleItem, onUpdateQuantity, onRemove, onRemoveAll, formatPrice }) => {
  const { productId, productName, productImage, variants, totalQuantity, totalPrice } = groupedProduct;
  
  const allVariantsSelected = variants.every(v => selectedItems.has(v.variantId));
  const someVariantsSelected = variants.some(v => selectedItems.has(v.variantId));
  
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

  return (
    <div className="bg-white border border-gray-200 p-3 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 md:hover:translate-y-[-4px]">
      <div className="flex gap-3 md:gap-6">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={allVariantsSelected}
            ref={input => {
              if (input) input.indeterminate = someVariantsSelected && !allVariantsSelected;
            }}
            onChange={handleToggleAllVariants}
            className="w-3.5 h-3.5 md:w-4 md:h-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
          />
        </div>
        
        {/* Image */}
        <Link
          to={`/products/${productId}`}
          className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 bg-gray-100 overflow-hidden rounded"
        >
          <img
            src={productImage || '/placeholder.jpg'}
            alt={productName || 'Product'}
            className="w-full h-full object-cover hover:opacity-75 transition-opacity"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name & Remove Button */}
          <div className="flex items-start justify-between mb-2 md:mb-4">
            <Link
              to={`/products/${productId}`}
              className="font-normal text-sm md:text-base text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 flex-1"
            >
              {productName}
            </Link>
            <button
              onClick={() => onRemoveAll(variants.map(v => v.variantId))}
              className="ml-2 md:ml-4 p-1 md:p-2 text-gray-400 hover:text-gray-900 transition-colors"
              title="Xóa tất cả"
            >
              <FaTimes size={12} className="md:hidden" />
              <FaTimes size={14} className="hidden md:block" />
            </button>
          </div>

          {/* Variants List */}
          <div className="space-y-3 md:space-y-4">
            {variants.map((variant) => (
              <div key={variant.variantId} className="flex items-start gap-2 md:gap-4 pb-3 md:pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(variant.variantId)}
                    onChange={() => onToggleItem(variant.variantId)}
                    className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                  />
                </div>
                
                {/* Variant Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 md:gap-2 text-xs mb-2 md:mb-4">
                    {variant.size && (
                      <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded text-[10px] md:text-xs">
                        <span className="hidden sm:inline">Kích thước: </span>{variant.size}
                      </span>
                    )}
                    {variant.color && (
                      <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded text-[10px] md:text-xs">
                        <span className="hidden sm:inline">Màu: </span>{variant.color}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex items-center justify-between md:justify-start gap-3 md:gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, -1)}
                          disabled={variant.quantity <= 1}
                          className="w-7 h-7 md:w-8 md:h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          <FaMinus size={8} className="md:hidden" />
                          <FaMinus size={10} className="hidden md:block" />
                        </button>
                        <input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            if (val >= 1 && val <= (variant.stock || 999)) {
                              onUpdateQuantity(variant.variantId, val, 0);
                            }
                          }}
                          className="w-10 h-7 md:w-12 md:h-8 text-center text-xs md:text-sm border-x border-gray-300 focus:outline-none"
                          min="1"
                          max={variant.stock || 999}
                        />
                        <button
                          onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, 1)}
                          disabled={variant.quantity >= (variant.stock || 999)}
                          className="w-7 h-7 md:w-8 md:h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          <FaPlus size={8} className="md:hidden" />
                          <FaPlus size={10} className="hidden md:block" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-1 md:flex-initial">
                        <span className="text-base md:text-lg font-bold text-gray-900 block">
                          {formatPrice(variant.price * variant.quantity)}
                        </span>
                        {variant.quantity > 1 && (
                          <span className="text-[10px] md:text-xs text-gray-500">
                            {formatPrice(variant.price)} x {variant.quantity}
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(variant.variantId)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                      >
                        <FaTrash size={11} className="md:hidden" />
                        <FaTrash size={12} className="hidden md:block" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Total */}
          <div className="mt-3 md:mt-6 pt-3 md:pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs md:text-sm text-gray-600">
              Tổng: <span className="font-medium text-gray-900">{totalQuantity}</span> <span className="hidden sm:inline">sản phẩm</span>
            </div>
            <div className="text-right">
              <p className="text-base md:text-xl font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartItem;