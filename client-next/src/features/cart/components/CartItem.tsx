"use client";

import React from "react";
import { Trash2, Plus, Minus, Check } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { CartItem as CartItemType } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  toggleSelectItem: (id: string) => void;
}

export function CartItem({ item, updateQuantity, removeItem, toggleSelectItem }: CartItemProps) {
  return (
    <Card className={cn(
      "overflow-hidden border transition-all duration-300 rounded-3xl",
      item.selected ? "border-primary/20 bg-primary/5 ring-1 ring-primary/5" : "border-slate-100 bg-white"
    )}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-6 items-start sm:items-center relative">
          <div className="flex items-center self-center sm:self-auto">
            {/* Checkbox */}
            <button 
              onClick={() => toggleSelectItem(item.variantId)}
              className={cn(
                "w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all",
                item.selected ? "bg-primary border-primary text-white" : "border-slate-300 hover:border-primary bg-white"
              )}
            >
              {item.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>

          {/* Image */}
          <div className="h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white flex items-center justify-center p-1.5 border border-slate-50">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="max-h-full max-w-full object-contain mix-blend-multiply" 
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between min-w-0 min-h-[64px] sm:min-h-[96px]">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5">
                <Link 
                  href={`/shop/${item.slug}`} 
                  className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2 text-sm sm:text-base leading-tight"
                >
                  {item.name}
                </Link>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {(item.color || item.size) && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-wide">Loại:</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded">
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                {item.discountedPrice && item.discountedPrice < item.price ? (
                  <div className="flex flex-col items-end">
                    <p className="text-sm sm:text-lg font-bold text-primary tabular-nums">
                      {formatCurrency(item.discountedPrice)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 line-through font-semibold tabular-nums">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ) : item.originalPrice && item.originalPrice > item.price ? (
                  <div className="flex flex-col items-end">
                    <p className="text-sm sm:text-lg font-bold text-primary tabular-nums">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 line-through font-semibold tabular-nums">
                      {formatCurrency(item.originalPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-lg font-bold text-primary tabular-nums">
                    {formatCurrency(item.price)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 sm:mt-4">
              {/* Quantity Controls */}
              <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-white border border-slate-50 hover:text-primary transition-all active:scale-95"
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                >
                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
                <span className="w-6 sm:w-8 text-center font-bold text-slate-700 text-[11px] sm:text-xs">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-white border border-slate-50 hover:text-primary transition-all active:scale-95"
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                >
                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right hidden xs:block">
                  <p className="text-xs sm:text-sm font-bold text-primary tabular-nums">
                    {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg h-7 w-7 sm:h-8 sm:w-8 transition-colors"
                  onClick={() => removeItem(item.variantId)}
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
