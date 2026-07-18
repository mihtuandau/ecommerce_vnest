"use client";

import React, { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { Product, ProductVariant } from "@/types/models";
import { getImageUrl } from "@/utils/image";
import { SizeGuideModal } from "./SizeGuideModal";
import { shouldShowSizeGuide } from "./sizeGuideVisibility";

interface ProductActionsProps {
  product: Product;
  finalPrice: number;
  finalOriginalPrice?: number | null;
  currentStock: number;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedVariant: ProductVariant | null;
}

export function ProductActions({
  product,
  finalPrice,
  finalOriginalPrice,
  currentStock,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  selectedVariant,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addItem, setBuyNowItem } = useCart();
  const { success, error } = useToast();
  const router = useRouter();

  const sizes = useMemo(() => {
    const s = new Set<string>();
    product.variants?.forEach((v) => v.isActive && v.size && s.add(v.size));
    return Array.from(s);
  }, [product.variants]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    product.variants?.forEach((v) => v.isActive && v.color && c.add(v.color));
    return Array.from(c);
  }, [product.variants]);

  const showSizeGuide = useMemo(
    () => shouldShowSizeGuide(product, sizes),
    [product, sizes]
  );

  const validateSelection = () => {
    if (sizes.length > 0 && !selectedSize) {
      error("Vui lòng chọn kích thước");
      return false;
    }
    if (colors.length > 0 && !selectedColor) {
      error("Vui lòng chọn màu sắc");
      return false;
    }
    if (!selectedVariant) {
      error("Phiên bản này hiện không khả dụng");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection() || !selectedVariant) return;

    addItem({
      productId: String(product.id),
      variantId: String(selectedVariant.id),
      name: product.name,
      price: finalPrice,
      originalPrice: finalOriginalPrice || undefined,
      imageUrl: getImageUrl(selectedVariant.images?.[0] || product.images?.[0]),
      slug: product.slug,
      quantity,
      color: selectedVariant.color,
      size: selectedVariant.size,
    });
    success("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (!validateSelection() || !selectedVariant) return;

    setBuyNowItem({
      productId: String(product.id),
      variantId: String(selectedVariant.id),
      name: product.name,
      price: finalPrice,
      originalPrice: finalOriginalPrice || undefined,
      imageUrl: getImageUrl(selectedVariant.images?.[0] || product.images?.[0]),
      slug: product.slug,
      quantity,
      color: selectedVariant.color,
      size: selectedVariant.size,
    });
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {colors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-taupe uppercase tracking-widest">
                Màu sắc
              </span>
              <span className="text-[12px] font-bold text-brand-bronze">
                {selectedColor || "Chưa chọn"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setSelectedColor(color === selectedColor ? null : color)
                  }
                  className={cn(
                    "min-w-[4rem] px-5 py-2 rounded-full text-[11.5px] font-bold transition-all border",
                    selectedColor === color
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                      : "bg-white border-brand-ivory text-brand-taupe hover:border-brand-bronze hover:text-primary"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-brand-taupe uppercase tracking-widest">
                  Kích thước
                </span>
                {showSizeGuide && (
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] text-brand-bronze hover:underline transition-colors"
                  >
                    (Hướng dẫn chọn size)
                  </button>
                )}
              </div>
              <span className="text-[12px] font-bold text-brand-bronze">
                {selectedSize || "Chưa chọn"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={cn(
                    "min-w-[4rem] px-5 py-2 rounded-full text-[11.5px] font-bold transition-all border",
                    selectedSize === size
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                      : "bg-white border-brand-ivory text-brand-taupe hover:border-brand-bronze hover:text-primary"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                currentStock > 0 ? "bg-[#3A7D5A]" : "bg-[#C44040]"
              )}
            />
            <span
              className={cn(
                "text-[11.5px] font-bold",
                currentStock > 0 ? "text-[#3A7D5A]" : "text-[#C44040]"
              )}
            >
              {currentStock > 0 ? `Sẵn hàng (${currentStock} sản phẩm)` : "Hết hàng"}
            </span>
          </div>

          <div className="flex items-center bg-white rounded-full p-0.5 border border-brand-ivory">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-8 w-8 flex items-center justify-center hover:bg-brand-ivory/50 rounded-full transition-all text-primary"
            >
              <Minus size={13} />
            </button>
            <span className="w-10 text-center text-[13px] font-bold text-primary tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
              className="h-8 w-8 flex items-center justify-center hover:bg-brand-ivory/50 rounded-full transition-all text-primary"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="w-full sm:flex-1 h-12 rounded-full border border-primary text-primary font-bold text-[12px] hover:bg-primary/5 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <ShoppingCart size={15} /> Thêm vào giỏ hàng
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className="w-full sm:flex-[1.2] h-12 rounded-full bg-primary text-white font-bold text-[12px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
        </div>
      </div>

      {showSizeGuide && (
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      )}
    </div>
  );
}
