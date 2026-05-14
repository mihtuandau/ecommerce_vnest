"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingBasket } from "lucide-react";
import { useCart } from "@/features/cart/hooks";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

export function CartDropdown() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { toggleSelectAll } = useCartStore();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    toggleSelectAll(true);
    setIsOpen(false);
    router.push(ROUTES.CHECKOUT);
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-600">
        <ShoppingCart className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link 
        href={ROUTES.CART}
        onClick={(e) => {
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            // Let Link handle navigation
          } else {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <Button 
          id="cart-icon"
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative h-10 w-10 rounded-full transition-all duration-300",
            isOpen ? "text-[#C4783A] bg-[#C4783A]/5" : "text-[#8A7966] hover:text-[#C4783A] hover:bg-[#C4783A]/5"
          )}
        >

          <ShoppingCart className="h-6 w-6" />
          {totalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#3D2B1A] text-xs font-bold text-[#FAF8F4] shadow-sm ring-2 ring-white">
              {totalCount}
            </span>
          )}
        </Button>
      </Link>

      {/* Dropdown Box */}
      <div 
        className={cn(
          "absolute right-0 top-full pt-4 z-50 transition-all duration-300 transform origin-top-right w-[380px] hidden lg:block",
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none translate-y-2"
        )}
      >
        <div className="bg-[#FAF8F4] rounded-3xl border border-[#DDD6C8] shadow-[0_20px_50px_rgba(61,43,26,0.1)] overflow-hidden flex flex-col max-h-[580px]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#DDD6C8] flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-sm font-bold text-[#3D2B1A] flex items-center gap-2 font-serif">
              <ShoppingBasket className="w-4 h-4 text-[#C4783A]" />
              Giỏ hàng của bạn
            </h3>
            <span className="text-xs font-semibold text-[#8A7966] bg-[#F3EFE8] px-2.5 py-0.5 rounded-full">
              {totalCount} món
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 bg-white">
            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#F3EFE8] rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-[#C4B49A]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#3D2B1A]">Giỏ hàng trống</p>
                  <p className="text-xs text-[#8A7966] font-normal">Hãy thêm vài món vào giỏ nhé!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="group relative flex gap-4 p-2 rounded-2xl hover:bg-[#FAF8F4] transition-all duration-200">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#F3EFE8] border border-[#DDD6C8] p-1 flex items-center justify-center">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#3D2B1A] line-clamp-1 group-hover:text-[#C4783A] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        {(item.color || item.size) && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.color && (
                              <span className="text-[9px] font-bold text-[#8A7966] bg-[#F3EFE8] border border-[#DDD6C8] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Màu: {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-[9px] font-bold text-[#8A7966] bg-[#F3EFE8] border border-[#DDD6C8] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-xs font-semibold text-[#3D2B1A] font-serif">{formatCurrency(item.discountedPrice || item.price)}</p>
                            {item.discountedPrice && item.discountedPrice < item.price ? (
                              <span className="text-[10px] text-[#8A7966] line-through font-bold tabular-nums">
                                {formatCurrency(item.price)}
                              </span>
                            ) : (item.originalPrice && item.originalPrice > (item.discountedPrice || item.price)) ? (
                              <span className="text-[10px] text-[#8A7966] line-through font-bold tabular-nums">
                                {formatCurrency(item.originalPrice)}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-[#8A7966] font-bold uppercase tracking-widest">x {item.quantity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        {/* Minimized controls */}
                        <div className="flex items-center bg-white border border-[#DDD6C8] rounded-lg p-0.5">
                          <button
                            className="h-6 w-6 rounded-md hover:bg-[#F3EFE8] hover:text-[#C4783A] transition-all flex items-center justify-center text-[#8A7966]"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item.variantId, item.quantity - 1);
                            }}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#3D2B1A]">
                            {item.quantity}
                          </span>
                          <button
                            className="h-6 w-6 rounded-md hover:bg-[#F3EFE8] hover:text-[#C4783A] transition-all flex items-center justify-center text-[#8A7966]"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item.variantId, item.quantity + 1);
                            }}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        
                        <button
                          className="h-7 w-7 text-[#C4B49A] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.variantId);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FAF8F4] border-t border-[#DDD6C8] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8A7966] uppercase tracking-widest">Tạm tính:</span>
                <span className="text-[20px] font-semibold text-[#3D2B1A] tabular-nums tracking-tighter font-serif">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCheckout();
                  }} 
                  className="w-full rounded-full h-12 bg-[#3D2B1A] hover:bg-[#C4783A] text-[#FAF8F4] font-semibold text-xs shadow-xl shadow-[#3D2B1A]/10 group active:scale-95 transition-all border-none"
                >
                  Thanh toán ngay
                  <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link 
                  href={ROUTES.CART} 
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-full h-10 text-[#8A7966] hover:text-[#3D2B1A] hover:bg-[#E8E0D0]/50 flex items-center justify-center text-xs font-medium transition-all"
                >
                  Xem chi tiết giỏ hàng
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
