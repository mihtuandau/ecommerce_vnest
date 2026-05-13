"use client";

import React from "react";
import { Trash2, Plus, Minus, Check, ChevronDown, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { CartItem as CartItemType } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  toggleSelectItem: (id: string) => void;
}

export const CartItem = React.memo(function CartItem({ 
  item, 
  updateQuantity, 
  removeItem, 
  toggleSelectItem 
}: CartItemProps) {
  const currentPrice = item.discountedPrice || item.price;
  const oldPrice = item.originalPrice || (item.discountedPrice ? item.price : 0);
  const savings = oldPrice > currentPrice ? oldPrice - currentPrice : 0;

  return (
    <div className="py-5 first:pt-4 border-b border-slate-100 last:border-0 group">
      <div className="flex gap-4 items-start">
        {/* Checkbox */}
        <button 
          onClick={() => toggleSelectItem(item.variantId)}
          className={cn(
            "mt-4 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all",
            item.selected 
              ? "bg-primary border-primary text-white" 
              : "border-slate-300 hover:border-primary bg-white"
          )}
        >
          {item.selected && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Product Image */}
        <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-xl bg-slate-50/80 flex items-center justify-center p-2 border border-slate-100 relative">
          {/* Badge Example (Optional based on design) */}
          {/* <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Vừa thêm</span> */}
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill
            className="object-contain p-2 mix-blend-multiply" 
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-h-[96px] sm:min-h-[112px]">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            {/* Left side: Info */}
            <div className="space-y-1.5 flex-1 pr-4">
              <Link 
                href={`/shop/${item.slug}`} 
                className="text-sm font-semibold text-slate-800 hover:text-primary transition-colors leading-snug line-clamp-2"
              >
                {item.name}
              </Link>
              
              <div className="text-[12px] text-slate-500 font-medium">
                Màu: {item.color || "Mặc định"} {item.size ? `· Size: ${item.size}` : ""}
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-bold text-slate-900">
                    {formatCurrency(currentPrice)}
                  </span>
                  {oldPrice > 0 && (
                    <span className="text-[12px] text-slate-400 line-through font-medium">
                      {formatCurrency(oldPrice)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Tiết kiệm {formatCurrency(savings)}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex flex-col gap-3 items-start sm:items-end w-full sm:w-auto">
              {/* Quantity Control */}
              <div className="flex items-center h-8 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                <button 
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <div className="w-10 h-full flex items-center justify-center text-[13px] font-semibold text-slate-700 border-x border-slate-200">
                  {item.quantity}
                </div>
                <button 
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-semibold">
                  <span className="text-sm">♡</span> Lưu
                </button>
                <button 
                  onClick={() => removeItem(item.variantId)}
                  className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all text-xs font-semibold"
                >
                  <Trash2 size={13} /> Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
