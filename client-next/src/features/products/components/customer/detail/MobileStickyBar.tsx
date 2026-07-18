"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { getImageUrl } from "@/utils/image";
import { Product, ProductVariant } from "@/types/models";

interface MobileStickyBarProps {
  product: Product;
  finalPrice: number;
  finalOriginalPrice?: number | null;
  currentStock: number;
  selectedVariant: ProductVariant | null;
  selectedSize: string | null;
  selectedColor: string | null;
}

export function MobileStickyBar({
  product,
  finalPrice,
  finalOriginalPrice,
  currentStock,
  selectedVariant,
  selectedSize,
  selectedColor,
}: MobileStickyBarProps) {
  const { addItem, setBuyNowItem } = useCart();
  const { success, error } = useToast();
  const router = useRouter();

  const hasSizes = product.variants?.some((v) => v.isActive && v.size);
  const hasColors = product.variants?.some((v) => v.isActive && v.color);

  const validateSelection = () => {
    if (hasSizes && !selectedSize) {
      error("Vui lòng chọn kích thước");
      return false;
    }
    if (hasColors && !selectedColor) {
      error("Vui lòng chọn màu sắc");
      return false;
    }
    if (!selectedVariant) {
      error("Phiên bản này hiện không khả dụng");
      return false;
    }
    return true;
  };

  const buildCartItem = () => ({
    productId: String(product.id),
    variantId: String(selectedVariant!.id),
    name: product.name,
    price: finalPrice,
    originalPrice: finalOriginalPrice || undefined,
    imageUrl: getImageUrl(selectedVariant!.images?.[0] || product.images?.[0]),
    slug: product.slug,
    quantity: 1,
    color: selectedVariant!.color,
    size: selectedVariant!.size,
  });

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addItem(buildCartItem());
    success("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    setBuyNowItem(buildCartItem());
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-sand shadow-[0_-8px_30px_rgba(61,43,26,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 shrink-0">
          <p className="text-[16px] font-bold text-brand-espresso tabular-nums leading-none">
            {formatCurrency(finalPrice)}
          </p>
          {finalOriginalPrice && finalOriginalPrice > finalPrice && (
            <p className="text-[11px] text-brand-taupe/60 line-through tabular-nums mt-0.5">
              {formatCurrency(finalOriginalPrice)}
            </p>
          )}
        </div>
        <div className="flex-1 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="h-11 w-11 shrink-0 rounded-full border border-primary text-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className="h-11 flex-1 rounded-full bg-primary text-white font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
