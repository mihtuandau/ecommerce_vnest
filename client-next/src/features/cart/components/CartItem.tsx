"use client";

import React from "react";
import { Trash2, Plus, Minus, Check } from "lucide-react";
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
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
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <Link 
                  href={`/shop/${item.slug}`} 
                  className="text-base lg:text-lg font-semibold text-slate-900 hover:text-primary transition-colors leading-snug"
                >
                  {item.name}
                </Link>
                
                <div className="flex items-center gap-2 text-[13px] text-slate-400 font-medium">
                  {item.color && <span>{item.color}</span>}
                  {item.color && item.size && <span className="text-slate-200">|</span>}
                  {item.size && <span>{item.size}</span>}
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <p className="text-base font-semibold text-primary">
                    {formatCurrency(item.discountedPrice || item.price)}
                  </p>
                </div>
              </div>

              {/* Action Side */}
              <div className="flex items-center gap-6 lg:gap-10">
                <div className="relative group">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value))}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 hover:border-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/10 min-w-[65px]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
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
