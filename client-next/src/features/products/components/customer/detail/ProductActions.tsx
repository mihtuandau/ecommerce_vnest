"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Facebook,
  Twitter,
  Mail,
  Link2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: any;
  finalPrice: number;
  finalOriginalPrice?: number | null;
  currentStock: number;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedVariant: any;
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
  const { addItem, setBuyNowItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success, error } = useToast();
  const router = useRouter();

  const isFavorite = isInWishlist(String(product.id));

  // Extract unique sizes and colors
  const sizes = useMemo(() => {
    const s = new Set<string>();
    product.variants?.forEach((v: any) => v.isActive && v.size && s.add(v.size));
    return Array.from(s);
  }, [product.variants]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    product.variants?.forEach((v: any) => v.isActive && v.color && c.add(v.color));
    return Array.from(c);
  }, [product.variants]);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: finalPrice,
      imageUrl: (typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url) || "/placeholder.png",
      slug: product.slug,
      stock: currentStock,
    });
    if (!isFavorite) {
      success(`Đã thêm ${product.name} vào danh sách yêu thích`);
    }
  };

  const validateSelection = () => {
    if (sizes.length > 0 && !selectedSize) {
      error("Vui lòng chọn kích thước");
      return false;
    }
    if (colors.length > 0 && !selectedColor) {
      error("Vui lòng chọn màu sắc");
      return false;
    }
    if (!selectedVariant && product.variants?.length > 0) {
      error("Phiên bản này hiện không khả dụng");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    addItem({
      productId: String(product.id),
      variantId: String(selectedVariant?.id || product.id),
      name: product.name,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      imageUrl: selectedVariant?.images?.[0]?.url || product.images?.[0]?.url || product.images?.[0] || "/placeholder.png",
      slug: product.slug,
      quantity: quantity,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    setBuyNowItem({
      productId: String(product.id),
      variantId: String(selectedVariant?.id || product.id),
      name: product.name,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      imageUrl: selectedVariant?.images?.[0]?.url || product.images?.[0]?.url || product.images?.[0] || "/placeholder.png",
      slug: product.slug,
      quantity: quantity,
      color: selectedVariant?.color,
      size: selectedVariant?.size,
    });
    
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="space-y-8">
      {/* ── Variant Selection ── */}
      <div className="space-y-6">
        {/* Colors */}
        {colors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Màu sắc</span>
              {selectedColor && <span className="text-[10px] font-bold text-primary">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    selectedColor === color 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kích thước</span>
              {selectedSize && <span className="text-[10px] font-bold text-primary">{selectedSize}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={cn(
                    "min-w-[3.5rem] px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    selectedSize === size 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-white"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Availability ── */}
      <div className="flex items-center gap-2 py-1">
        <div className={cn("h-1.5 w-1.5 rounded-full", currentStock > 0 ? "bg-green-500" : "bg-rose-500")} />
        <span className={cn("text-[11px] font-bold uppercase tracking-tight", currentStock > 0 ? "text-green-600" : "text-rose-600")}>
          {currentStock > 0 ? `Còn hàng (${currentStock} sản phẩm)` : "Hết hàng"}
        </span>
      </div>

      {/* ── Quantity ── */}
      <div className="flex items-center gap-6 py-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">Số lượng</span>
        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-9 w-9 flex items-center justify-center hover:bg-white rounded-lg transition-all"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
            className="h-9 w-9 flex items-center justify-center hover:bg-white rounded-lg transition-all"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="flex-1 h-12 rounded-2xl border-2 border-primary text-primary font-bold text-xs hover:bg-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={currentStock <= 0}
          className="flex-[1.2] h-12 rounded-2xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mua ngay
        </button>
        <button 
          onClick={handleToggleWishlist}
          className={cn(
            "h-12 w-12 rounded-2xl border-2 transition-all flex items-center justify-center group shrink-0",
            isFavorite 
              ? "border-rose-500 bg-rose-50 text-rose-500" 
              : "border-slate-100 hover:border-rose-500 text-slate-400 hover:text-rose-500"
          )}
        >
          <Heart className={cn("h-4 w-4 transition-transform group-active:scale-90", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* ── Delivery Info ── */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-8 border-t border-slate-50">
        {[
          "Giao hàng 2-3 ngày",
          "Bảo hành chính hãng",
          "Đổi trả 30 ngày",
          "Đóng gói cẩn thận"
        ].map((info, i) => (
          <div key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            {info}
          </div>
        ))}
      </div>
    </div>
  );
}
