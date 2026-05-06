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
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
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
}

export function QuickAddModal({
  product,
  isOpen,
  onClose,
  price,
  originalPrice,
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

  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const currentPrice = selectedVariant?.price ?? price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? originalPrice;

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
    onClose();
  };


  const productImageUrl = getImageUrl(
    selectedVariant?.images?.[0] || product.images?.[0]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Thêm vào giỏ hàng
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Product Brief */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
              <Image
                src={productImageUrl}
                alt={product.name}
                fill
                className="object-contain p-2 mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(currentPrice)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(currentOriginalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Màu sắc
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                        selectedColor === color
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Kích thước
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[3rem] px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                        selectedSize === size
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Stock */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(currentStock || 1, quantity + 1))
                }
                className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "text-[10px] font-bold",
                  currentStock > 0 ? "text-green-600" : "text-rose-600"
                )}
              >
                {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : "Hết hàng"}
              </span>
            </div>
          </div>

          {/* Action */}
          <Button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-[#0d47a1] text-white font-bold text-sm shadow-xl shadow-primary/20 gap-2 transition-all active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" /> Xác nhận thêm vào giỏ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
