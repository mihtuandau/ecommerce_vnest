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
  return (
    <div className="py-10 first:pt-0 border-b border-slate-100 last:border-0 group">
      <div className="flex gap-4 lg:gap-8 relative items-center">
        {/* Individual Selection Checkbox */}
        <button 
          onClick={() => toggleSelectItem(item.variantId)}
          className={cn(
            "w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all",
            item.selected 
              ? "bg-primary border-primary text-white" 
              : "border-slate-200 hover:border-primary bg-white"
          )}
        >
          {item.selected && (
            <Check size={12} strokeWidth={4} />
          )}
        </button>

        {/* Product Image */}
        <div className="h-32 w-32 lg:h-40 lg:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50/50 flex items-center justify-center p-4 border border-slate-100/50 relative">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill
            className="object-contain p-4 mix-blend-multiply" 
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between self-stretch">
          <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Link 
                    href={`/shop/${item.slug}`} 
                    className="text-base lg:text-lg font-semibold text-slate-900 hover:text-primary transition-colors leading-snug overflow-hidden block"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.name}
                  </Link>
                  
                  <div className="flex items-center gap-2 text-[13px] text-slate-400 font-medium">
                    {item.color && <span>{item.color}</span>}
                    {item.color && item.size && <span className="text-slate-200">|</span>}
                    {item.size && <span>{item.size}</span>}
                  </div>

                  <div className="pt-1 flex items-baseline gap-3">
                    <p className="text-base font-semibold text-primary">
                      {formatCurrency(item.discountedPrice || item.price)}
                    </p>
                    {item.discountedPrice && item.discountedPrice < item.price ? (
                      <span className="text-[11px] text-slate-400 line-through font-medium tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    ) : (item.originalPrice && item.originalPrice > (item.discountedPrice || item.price)) ? (
                      <span className="text-[11px] text-slate-400 line-through font-medium tabular-nums">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Action Side */}
                <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-6 mt-2 sm:mt-0">
                  <div className="relative">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value))}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 hover:border-primary transition-all cursor-pointer focus:outline-none min-w-[60px]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={12} strokeWidth={3} />
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 mt-auto">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[13px] font-medium text-slate-400">Còn hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
});
