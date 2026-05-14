"use client";

import React from "react";
import { Trash2, Plus, Minus, Check, Heart, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { CartItem as CartItemType } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  toggleSelectItem: (id: string) => void;
  isGrouped?: boolean;
}

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const CartItem = React.memo(function CartItem({ 
  item, 
  updateQuantity, 
  removeItem, 
  toggleSelectItem,
  isGrouped = false
}: CartItemProps) {
  const currentPrice = item.discountedPrice || item.price;
  const oldPrice = item.originalPrice || (item.discountedPrice ? item.price : 0);
  const savings = oldPrice > currentPrice ? oldPrice - currentPrice : 0;

  return (
    <div className={cn(
      "p-4 transition-all group/item",
      isGrouped 
        ? "bg-transparent hover:bg-[#FAF8F4]/50 border-none" 
        : "bg-white rounded-2xl border border-[#DDD6C8] shadow-sm hover:shadow-md"
    )}>
      <div className="flex gap-4 items-center">
        {/* Checkbox */}
        <button 
          onClick={() => toggleSelectItem(item.variantId)}
          className={cn(
            "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all",
            item.selected 
              ? "bg-[#3D2B1A] border-[#3D2B1A] text-white" 
              : "border-[#DDD6C8] hover:border-[#3D2B1A] bg-white"
          )}
        >
          {item.selected && <Check size={10} strokeWidth={4} />}
        </button>

        {/* Product Image */}
        <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-[#FAF8F4] flex items-center justify-center p-2 relative overflow-hidden">
          <Image 
            src={getImageUrl(item.imageUrl)} 
            alt={item.name} 
            fill
            className="object-contain p-1.5 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Info Side */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-1">
              {!isGrouped && <span className="text-[10px] font-black text-[#8A7966] uppercase tracking-[0.2em]">BRAND</span>}
              <Link 
                href={`/shop/${item.slug}`} 
                className={cn(
                  "block hover:text-[#C4783A] transition-colors leading-tight font-serif tracking-tight",
                  isGrouped ? "text-[14px] font-medium text-[#3D2B1A]" : "text-[15px] font-semibold text-[#3D2B1A]"
                )}
              >
                {item.name}
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-[#FAF8F4] border border-[#DDD6C8] text-[#8A7966] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Màu: {item.color || "Mặc định"}
              </span>
              {item.size && (
                <span className="bg-[#FAF8F4] border border-[#DDD6C8] text-[#8A7966] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Size: {item.size}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-0.5">
              <button className="flex items-center gap-1 text-[11px] font-bold text-[#8A7966] hover:text-[#3D2B1A] transition-colors group/btn">
                <Heart size={13} className="group-hover/btn:fill-[#3D2B1A]" /> 
                Lưu yêu thích
              </button>
              <div className="w-[1px] h-3 bg-[#DDD6C8]" />
              <button 
                onClick={() => removeItem(item.variantId)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#8A7966] hover:text-red-500 transition-colors"
              >
                <X size={13} /> 
                Xoá
              </button>
            </div>
          </div>

          {/* Pricing & Control Side */}
          <div className="flex flex-col items-end gap-3 min-w-[120px]">
            <div className="text-right">
              <div className="text-[16px] font-bold text-[#3D2B1A] tabular-nums font-serif">
                {formatCurrency(currentPrice)}
              </div>
              {oldPrice > currentPrice && (
                <div className="text-[12px] text-[#8A7966] line-through font-medium opacity-50">
                  {formatCurrency(oldPrice)}
                </div>
              )}
              {savings > 0 && (
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Tiết kiệm {formatCurrency(savings)}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center h-8 bg-[#FAF8F4] border border-[#DDD6C8] rounded-lg overflow-hidden">
              <button 
                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                className="w-8 h-full flex items-center justify-center text-[#3D2B1A] hover:bg-white transition-all"
              >
                <Minus size={12} />
              </button>
              <div className="w-9 h-full flex items-center justify-center text-[13px] font-bold text-[#3D2B1A] border-x border-[#DDD6C8] bg-white/50">
                {item.quantity}
              </div>
              <button 
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                className="w-8 h-full flex items-center justify-center text-[#3D2B1A] hover:bg-white transition-all"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
