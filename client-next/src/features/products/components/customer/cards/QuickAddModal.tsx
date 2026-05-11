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
}

export function QuickAddModal({
  product,
  isOpen,
  onClose,
  price,
  originalPrice,
  flashSalePercent = 0,
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
    return product.variants?.reduce((acc, v) => acc + (v.isActive !== false ? (v.stock ?? 0) : 0), 0) ?? 0;
  }, [product.variants]);

  const currentStock = selectedVariant?.stock ?? (product.variants && product.variants.length > 0 ? totalVariantsStock : (product.stock ?? 0));
  const variantBasePrice = selectedVariant?.price ?? price;
  const variantOriginalPriceVal = selectedVariant?.originalPrice ?? originalPrice;

  const currentPrice = flashSalePercent > 0
    ? Math.round(variantBasePrice * (1 - flashSalePercent / 100))
    : variantBasePrice;

  const currentOriginalPrice = flashSalePercent > 0
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

    const imageUrl = getImageUrl(
      selectedVariant.images?.[0] || product.images?.[0]
    );

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
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white focus:outline-none">
        {/* Accessibility: Title & Description (Hidden) */}
        <div className="sr-only">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
          {/* Left: Product Image Section */}
          <div className="md:col-span-6 bg-white flex items-center justify-center p-6 relative overflow-hidden">
             <div className="relative w-full aspect-square">
                <Image
                  src={productImageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
             </div>
          </div>

          {/* Right: Product Info & Options Section */}
          <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-center bg-white">
            <div className="space-y-0.5 mb-2">
               <span className="text-xs font-semibold text-primary/80 tracking-wider">
                 Minh Tuấn Shop
               </span>
               <h2 className="text-lg font-bold text-slate-900 leading-snug pr-4">
                {product.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
               <span className="text-xl font-bold text-slate-900 tracking-tight">
                 {formatCurrency(currentPrice)}
               </span>
               {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                 <span className="text-sm font-medium text-slate-300 line-through">
                   {formatCurrency(currentOriginalPrice)}
                 </span>
               )}
            </div>

            <div className="space-y-6">
              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Màu sắc: <span className="text-slate-900 font-bold">{selectedColor || "Chưa chọn"}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-semibold transition-all border",
                          selectedColor === color
                            ? "bg-primary border-primary text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Kích thước: <span className="text-slate-900 font-bold">{selectedSize || "Chưa chọn"}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[3.5rem] px-5 py-2.5 rounded-xl text-xs font-semibold transition-all border-2",
                          selectedSize === size
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                 <span className="text-[11px] font-semibold text-slate-400">
                    Số lượng
                 </span>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(currentStock || 1, quantity + 1))
                        }
                        className="h-10 w-10 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <span className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full",
                      currentStock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : "Hết hàng"}
                    </span>
                 </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 h-14 rounded-2xl bg-white text-primary hover:bg-primary hover:text-white font-semibold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-primary/5 flex items-center justify-center transition-all active:scale-95 group tracking-wide"
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
