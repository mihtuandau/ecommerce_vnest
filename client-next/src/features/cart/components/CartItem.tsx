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
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4 md:gap-6 items-center">
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

          {/* Image */}
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2 border border-slate-50">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="max-h-full max-w-full object-contain mix-blend-multiply" 
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <Link 
                  href={`/shop/${item.slug}`} 
                  className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-2 text-base leading-snug"
                >
                  {item.name}
                </Link>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {(item.color || item.size) && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phân loại:</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Sẵn có</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900 tabular-nums">{formatCurrency(item.price)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              {/* Quantity Controls */}
              <div className="flex items-center bg-slate-100/50 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-white border border-slate-50 hover:text-primary transition-all active:scale-95"
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-10 text-center font-medium text-slate-700 text-sm">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-white border border-slate-50 hover:text-primary transition-all active:scale-95"
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-base font-semibold text-primary tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl h-9 w-9 transition-colors"
                  onClick={() => removeItem(item.variantId)}
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
