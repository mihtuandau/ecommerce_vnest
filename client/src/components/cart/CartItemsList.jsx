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

  const totalPages = Math.ceil(groupedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = groupedProducts.slice(startIndex, endIndex);

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
      <div className="bg-white border border-gray-200 p-3 md:p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 md:gap-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="w-4 h-4 md:w-5 md:h-5 border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer rounded"
          />
          <h2 className="text-sm md:text-base font-bold text-gray-900">
            <span className="hidden sm:inline">Chọn tất cả </span>({count})
          </h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs md:text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          Xóa <span className="hidden sm:inline">tất cả</span>
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
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {startIndex + 1}–{Math.min(endIndex, groupedProducts.length)} / {groupedProducts.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[36px] h-9 text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-[#00a85a] text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-100'
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