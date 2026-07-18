"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Product, ProductVariant } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { getImageUrl } from "@/utils/image";
import Image from "next/image";

interface QuickAddModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  price: number;
  originalPrice?: number | null;
  flashSalePercent?: number;
  flashSaleFixedAmount?: number;
}

export function QuickAddModal({
  product,
  isOpen,
  onClose,
  price,
  originalPrice,
  flashSalePercent = 0,
  flashSaleFixedAmount = 0,
}: QuickAddModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { success, error } = useToast();

  // Extract unique sizes and colors
  const sizes = useMemo(() => {
    const s = new Set<string>();
    product.variants?.forEach((v) => v.isActive !== false && v.size && s.add(v.size));
    return Array.from(s);
  }, [product.variants]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    product.variants?.forEach((v) => v.isActive !== false && v.color && c.add(v.color));
    return Array.from(c);
  }, [product.variants]);

  // Find the selected variant
  const selectedVariant = useMemo(() => {
    if (!product.variants) return null;
    return (
      product.variants.find(
        (v) =>
          v.isActive !== false &&
          (sizes.length === 0 || v.size === selectedSize) &&
          (colors.length === 0 || v.color === selectedColor)
      ) || null
    );
  }, [product.variants, selectedSize, selectedColor, sizes.length, colors.length]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
    }
  }, [isOpen]);

  const totalVariantsStock = useMemo(() => {
    return (
      product.variants?.reduce(
        (acc, v) => acc + (v.isActive !== false ? (v.stock ?? 0) : 0),
        0
      ) ?? 0
    );
  }, [product.variants]);

  const currentStock =
    selectedVariant?.stock ??
    (product.variants && product.variants.length > 0
      ? totalVariantsStock
      : (product.stock ?? 0));
  const parsePrice = (val: string | number | undefined | null): number => {
    let num = 0;
    if (typeof val === "number") num = val;
    else if (typeof val === "string") num = parseFloat(val.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const variantBasePrice = parsePrice(selectedVariant?.price ?? price);
  const variantOriginalPriceVal = parsePrice(selectedVariant?.originalPrice ?? originalPrice);

  let currentPrice = variantBasePrice;
  if (flashSaleFixedAmount > 0) {
    currentPrice = Math.max(0, variantBasePrice - flashSaleFixedAmount);
  } else if (flashSalePercent > 0) {
    currentPrice = Math.round(variantBasePrice * (1 - flashSalePercent / 100));
  }

  const currentOriginalPrice =
    flashSalePercent > 0 || flashSaleFixedAmount > 0
      ? variantBasePrice
      : variantOriginalPriceVal;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      error("Vui lòng chọn kích thước");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      error("Vui lòng chọn màu sắc");
      return;
    }
    if (!selectedVariant) {
      error("Phiên bản này hiện không khả dụng");
      return;
    }

    const imageUrl = getImageUrl(selectedVariant.images?.[0] || product.images?.[0]);

    addItem({
      productId: String(product.id),
      variantId: String(selectedVariant.id),
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice || undefined,
      imageUrl,
      slug: product.slug,
      quantity,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
    });
    success("Đã thêm vào giỏ hàng");
    onClose();
  };

  const productImageUrl = getImageUrl(
    selectedVariant?.images?.[0] || product.images?.[0]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white focus:outline-none">
        <div className="sr-only">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
        </div>

        <div
          className="relative grid grid-cols-1 md:grid-cols-12 min-h-[450px]"
          onClick={(e) => e.stopPropagation()}
        >
          
          <div className="md:col-span-5 bg-white flex items-center justify-center p-8 relative border-b md:border-b-0 border-brand-ivory">
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={productImageUrl}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-6 left-6 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border border-brand-ivory flex items-center justify-center text-primary hover:bg-white transition-all z-50 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white border-l border-brand-ivory">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-brand-taupe uppercase tracking-[0.3em] mb-2 block">
                LUXE Storefront
              </span>
              <h2 className="text-[20px] font-bold text-primary leading-tight mb-3">
                {product.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[24px] font-bold text-primary font-serif">
                  {formatCurrency(currentPrice)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-[14px] font-medium text-brand-taupe/80 line-through">
                    {formatCurrency(currentOriginalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              
              {colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                      Màu sắc
                    </span>
                    <span className="text-[11px] font-bold text-brand-bronze">
                      {selectedColor || "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-5 py-2 rounded-full text-[12px] font-bold transition-all border",
                          selectedColor === color
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                            : "bg-white border-brand-ivory text-brand-taupe hover:border-brand-bronze"
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
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                      Kích thước
                    </span>
                    <span className="text-[11px] font-bold text-brand-bronze">
                      {selectedSize || "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[4rem] px-5 py-2 rounded-full text-[12px] font-bold transition-all border",
                          selectedSize === size
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                            : "bg-white border-brand-ivory text-brand-taupe hover:border-brand-bronze"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center bg-brand-cream rounded-full p-1 border border-brand-ivory">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 flex items-center justify-center hover:bg-white rounded-full transition-all text-primary"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-10 text-center text-[14px] font-bold text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(currentStock || 1, quantity + 1))
                    }
                    className="h-9 w-9 flex items-center justify-center hover:bg-white rounded-full transition-all text-primary"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      currentStock > 0 ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      currentStock > 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {currentStock > 0 ? `Còn ${currentStock}` : "Hết hàng"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="w-full h-14 rounded-full bg-primary text-white font-bold text-[13px] hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-primary/5"
              >
                <ShoppingCart size={16} /> Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>

        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border border-brand-ivory hidden md:flex items-center justify-center text-primary hover:bg-white transition-all z-50"
        >
          <X size={18} />
        </button>
      </DialogContent>
    </Dialog>
  );
}
