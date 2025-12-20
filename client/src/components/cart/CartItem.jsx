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
    <div className="bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
      <div className="flex gap-6">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={allVariantsSelected}
            ref={input => {
              if (input) input.indeterminate = someVariantsSelected && !allVariantsSelected;
            }}
            onChange={handleToggleAllVariants}
            className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
          />
        </div>
        
        {/* Image */}
        <Link
          to={`/products/${productId}`}
          className="flex-shrink-0 w-28 h-28 bg-gray-100 overflow-hidden"
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
          <div className="flex items-start justify-between mb-4">
            <Link
              to={`/products/${productId}`}
              className="font-normal text-base text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 flex-1"
            >
              {productName}
            </Link>
            <button
              onClick={() => onRemoveAll(variants.map(v => v.variantId))}
              className="ml-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
              title="Xóa tất cả"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Variants List */}
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.variantId} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
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
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {variant.size && (
                      <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded">
                        Kích thước: {variant.size}
                      </span>
                    )}
                    {variant.color && (
                      <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded">
                        Màu: {variant.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, -1)}
                        disabled={variant.quantity <= 1}
                        className="w-8 h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <FaMinus size={10} />
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
                        className="w-12 h-8 text-center text-sm border-x border-gray-300 focus:outline-none"
                        min="1"
                        max={variant.stock || 999}
                      />
                      <button
                        onClick={() => onUpdateQuantity(variant.variantId, variant.quantity, 1)}
                        disabled={variant.quantity >= (variant.stock || 999)}
                        className="w-8 h-8 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 block">
                        {formatPrice(variant.price * variant.quantity)}
                      </span>
                      {variant.quantity > 1 && (
                        <span className="text-xs text-gray-500">
                          {formatPrice(variant.price)} x {variant.quantity}
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(variant.variantId)}
                      className="p-2 text-gray-400 hover:text-gray-900 transition-colors ml-auto"
                      title="Xóa"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Total */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-medium text-gray-900">{totalQuantity}</span> sản phẩm
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
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