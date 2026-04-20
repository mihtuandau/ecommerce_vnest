import React from 'react';
import { FaTrash } from "react-icons/fa";
import { formatPrice } from "../../utils/formatters";

const CartDrawerItem = ({ item, index, discountMap, computeDiscountFromMap, onRemove }) => {
  const getProductImage = (item) => {
    return (
      item.product?.image ||
      item.product?.variant?.product?.images?.[0]?.url ||
      item.product?.images?.[0]?.url
    );
  };

  const originalPrice = item.product?.variant?.price || 0;
  const discountedPrice = computeDiscountFromMap(
    item.product?.id,
    originalPrice,
    discountMap
  );
  const hasDiscount = discountedPrice !== originalPrice;

  return (
    <div
      className="group flex gap-4 pb-4 border-b border-gray-100 last:border-0 cart-item-animate"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 overflow-hidden ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
        <img
          src={getProductImage(item) || "/placeholder.jpg"}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-black line-clamp-2 flex-1 leading-snug">
            {item.product?.name}
          </h3>
          <button
            onClick={() => onRemove(item.variantId)}
            type="button"
            className="text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0 cursor-pointer p-2"
            title="Xóa sản phẩm"
          >
            <FaTrash size={13} />
          </button>
        </div>

        {(item.product?.variant?.size || item.product?.variant?.color) && (
          <div className="flex gap-1.5 mb-2.5">
            {item.product?.variant?.size && (
              <span className="inline-flex px-1.5 py-0.5 text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 uppercase">
                {item.product.variant.size}
              </span>
            )}
            {item.product?.variant?.color && (
              <span className="inline-flex px-1.5 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-500 border border-gray-100 uppercase">
                {item.product.variant.color}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-black text-white">
            x{item.quantity}
          </span>
          <div className="text-right">
            {hasDiscount ? (
              <>
                <span className="text-sm font-semibold text-red-500 block font-inter">
                  {formatPrice(discountedPrice * item.quantity)}
                </span>
                <span className="text-[10px] text-gray-300 line-through font-inter">
                  {formatPrice(originalPrice * item.quantity)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-black font-inter">
                {formatPrice(originalPrice * item.quantity)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawerItem;
