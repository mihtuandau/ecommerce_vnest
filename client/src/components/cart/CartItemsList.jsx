import { useMemo, useState } from 'react';
import CartItem from './CartItem';

const getProductImage = (item) => {
  return item.product?.image || 
         item.product?.variant?.product?.images?.[0]?.url ||
         item.product?.images?.[0]?.url;
};

const createVariant = (item) => ({
  variantId: item.variantId,
  size: item.product?.variant?.size,
  color: item.product?.variant?.color,
  price: item.product?.variant?.price || 0,
  stock: item.product?.variant?.stock || 999,
  quantity: item.quantity
});

const ITEMS_PER_PAGE = 5;

const CartItemsList = ({ items, count, selectedItems, onToggleItem, onToggleAll, onUpdateQuantity, onRemove, onClearAll, formatPrice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const allSelected = items.length > 0 && selectedItems.size === items.length;
  
  const groupedProducts = useMemo(() => {
    const groups = {};
    
    items.forEach(item => {
      const productId = item.product?.id;
      if (!productId) return;
      
      if (!groups[productId]) {
        groups[productId] = {
          productId,
          productName: item.product?.name,
          productImage: getProductImage(item),
          variants: [],
          totalQuantity: 0,
          totalPrice: 0
        };
      }
      
      const variant = createVariant(item);
      groups[productId].variants.push(variant);
      groups[productId].totalQuantity += item.quantity;
      groups[productId].totalPrice += (variant.price * item.quantity);
    });
    
    return Object.values(groups);
  }, [items]);

  // Pagination calculations
  const totalPages = Math.ceil(groupedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = groupedProducts.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRemoveAll = async (variantIds) => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả biến thể của sản phẩm này?')) {
      for (const id of variantIds) {
        await onRemove(id, true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Chọn tất cả ({count} sản phẩm)
          </h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-4">
        {currentProducts.map((groupedProduct) => (
          <CartItem
            key={groupedProduct.productId}
            groupedProduct={groupedProduct}
            selectedItems={selectedItems}
            onToggleItem={onToggleItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onRemoveAll={handleRemoveAll}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, groupedProducts.length)} của {groupedProducts.length} sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[36px] h-9 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemsList;
