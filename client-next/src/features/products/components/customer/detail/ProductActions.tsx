"use client";

import React, { useState } from "react";
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
import { useUIStore } from "@/store/useUIStore";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: any;
  finalPrice: number;
  currentStock: number;
}

export function ProductActions({
  product,
  finalPrice,
  currentStock,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, setBuyNowItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success, error } = useToast();
  const router = useRouter();

  const isFavorite = isInWishlist(String(product.id));

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

  // Lấy variant mặc định (đầu tiên) nếu có
  const defaultVariant = product.variants?.find((v: any) => v.isActive) || product.variants?.[0];

  const handleAddToCart = () => {
    if (!defaultVariant && product.variants?.length > 0) {
      error("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    addItem({
      productId: String(product.id),
      variantId: String(defaultVariant?.id || product.id), // Fallback nếu ko có variant
      name: product.name,
      price: finalPrice,
      imageUrl:
        (typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0]?.url) || "/placeholder.png",
      slug: product.slug,
      quantity: quantity,
      color: defaultVariant?.color,
      size: defaultVariant?.size,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!defaultVariant && product.variants?.length > 0) {
      error("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    setBuyNowItem({
      productId: String(product.id),
      variantId: String(defaultVariant?.id || product.id),
      name: product.name,
      price: finalPrice,
      imageUrl:
        (typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0]?.url) || "/placeholder.png",
      slug: product.slug,
      quantity: quantity,
      color: defaultVariant?.color,
      size: defaultVariant?.size,
    });
    
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="space-y-6">
      {/* Availability */}
      <div className="flex items-center gap-2 py-1">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-semibold text-green-600">
          Còn hàng ({currentStock} sản phẩm)
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-6 py-1">
        <span className="text-xs font-medium text-slate-500 w-16">Số lượng</span>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-50 border-r border-slate-200 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-50 border-l border-slate-200 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <span className="text-[10px] text-slate-400">Tối đa {currentStock}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 h-11 rounded-lg border border-primary/20 text-primary font-semibold text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-[1.2] h-11 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-[#0d47a1] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
        >
          Mua ngay
        </button>
        <button 
          onClick={handleToggleWishlist}
          className={cn(
            "h-11 w-11 rounded-lg border transition-all flex items-center justify-center group",
            isFavorite 
              ? "border-rose-100 bg-rose-50 text-rose-500 shadow-sm shadow-rose-500/10" 
              : "border-slate-200 hover:border-rose-500 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"
          )}
        >
          <Heart className={cn("h-4 w-4 transition-transform group-active:scale-90", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Social Share */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Chia sẻ
        </span>
        <div className="flex items-center gap-2.5">
          {[
            { icon: Facebook, color: "hover:text-blue-600" },
            { icon: Twitter, color: "hover:text-sky-500" },
            { icon: Mail, color: "hover:text-rose-500" },
            { icon: Link2, color: "hover:text-slate-900" },
          ].map((social, i) => (
            <button
              key={i}
              className={cn(
                "h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-colors",
                social.color
              )}
            >
              <social.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-8 pt-8 border-t border-slate-50">
        <div className="text-[11px] font-medium text-slate-400">Giao hàng 2-3 ngày</div>
        <div className="text-[11px] font-medium text-slate-400">
          Bảo hành chính hãng
        </div>
        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
          Đổi trả 30 ngày
        </div>
        <div className="text-[11px] font-medium text-slate-400">Đóng gói cẩn thận</div>
      </div>
    </div>
  );
}
