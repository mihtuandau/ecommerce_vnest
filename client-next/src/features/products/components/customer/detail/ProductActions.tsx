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
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/types/models";

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
  const { addItem, setBuyNowItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success, error } = useToast();
  const router = useRouter();

  const isFavorite = isInWishlist(String(product.id));

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

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: finalPrice,
      imageUrl: (typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url) || "/placeholder.png",
      slug: product.slug,
      stock: currentStock,
    });
    if (!isFavorite) success(`Đã thêm vào danh sách yêu thích`);
  };

  const validateSelection = () => {
    if (sizes.length > 0 && !selectedSize) { error("Vui lòng chọn kích thước"); return false; }
    if (colors.length > 0 && !selectedColor) { error("Vui lòng chọn màu sắc"); return false; }
    if (!selectedVariant) { error("Phiên bản này hiện không khả dụng"); return false; }
    return true;
  };

  const getImageUrl = (img: any) => {
    if (!img) return "/placeholder.png";
    return typeof img === "string" ? img : img.url || "/placeholder.png";
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
      quantity: quantity,
      color: selectedVariant.color,
      size: selectedVariant.size,
    });
    success(`Đã thêm vào giỏ hàng`);
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
      quantity: quantity,
      color: selectedVariant.color,
      size: selectedVariant.size,
    });
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="space-y-10">
      <div className="space-y-8">
        {colors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Màu sắc</span>
              <span className="text-[12px] font-bold text-brand-bronze">{selectedColor || "Chưa chọn"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                  className={cn(
                    "min-w-[4.5rem] px-6 py-2.5 rounded-full text-[12px] font-bold transition-all border",
                    selectedColor === color 
                      ? "bg-primary border-primary text-white shadow-xl shadow-primary/10" 
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Kích thước</span>
              <span className="text-[12px] font-bold text-brand-bronze">{selectedSize || "Chưa chọn"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={cn(
                    "min-w-[4.5rem] px-6 py-2.5 rounded-full text-[12px] font-bold transition-all border",
                    selectedSize === size 
                      ? "bg-primary border-primary text-white shadow-xl shadow-primary/10" 
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

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", currentStock > 0 ? "bg-emerald-500" : "bg-rose-500")} />
            <span className={cn("text-[12px] font-bold", currentStock > 0 ? "text-emerald-600" : "text-rose-600")}>
              {currentStock > 0 ? `Sẵn hàng (${currentStock} sản phẩm)` : "Hết hàng"}
            </span>
          </div>
          
          <div className="flex items-center bg-white rounded-full p-1 border border-brand-ivory">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-9 w-9 flex items-center justify-center hover:bg-brand-ivory/50 rounded-full transition-all text-primary"><Minus size={14} /></button>
            <span className="w-12 text-center text-[14px] font-bold text-primary tabular-nums">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))} className="h-9 w-9 flex items-center justify-center hover:bg-brand-ivory/50 rounded-full transition-all text-primary"><Plus size={14} /></button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="w-full sm:flex-1 h-14 rounded-full border border-primary text-primary font-bold text-[13px] hover:bg-primary/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <ShoppingCart size={16} /> Thêm vào giỏ hàng
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className="w-full sm:flex-[1.2] h-14 rounded-full bg-primary text-white font-bold text-[13px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={cn(
              "h-14 w-full sm:w-14 rounded-full border transition-all flex items-center justify-center group shrink-0",
              isFavorite 
                ? "border-brand-bronze bg-brand-bronze text-white" 
                : "border-brand-sand hover:border-brand-bronze text-brand-taupe hover:text-brand-bronze"
            )}
          >
            <Heart size={20} className={cn("transition-transform group-active:scale-90", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>
    </div>
  );
}
