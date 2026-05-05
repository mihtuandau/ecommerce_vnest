"use client";

import React, { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Check, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";

// Sub-components
import { EmptyCart } from "./EmptyCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartItem as ICartItem } from "@/store/useCartStore";
import { useCart } from "../hooks";
import { cartApi } from "../api";
import { toast } from "sonner";

export function CartContainer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  
  const { setItems, toggleSelectItem, toggleSelectAll } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate derived state in component for better reactivity
  const selectedItems = items.filter(i => i.selected);
  const selectedCount = selectedItems.length;
  const selectedTotalPrice = selectedItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
  const isAllSelected = items.length > 0 && items.every((i) => i.selected);

  if (!mounted) {
    return (
      <div className="bg-slate-50/30 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <div className="flex items-center gap-5 border-b border-slate-200/60 pb-8">
            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-80 w-full rounded-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-5">
              <button 
                type="button"
                onClick={() => router.back()}
                className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50 transition-all shrink-0 shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Giỏ hàng của bạn</h1>
                <p className="text-slate-600 text-sm font-normal">Bạn có {items.length} sản phẩm trong giỏ hàng</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Product List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Select All Bar */}
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelectAll(!isAllSelected)}
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                      isAllSelected
                        ? "bg-primary border-primary text-white"
                        : "border-slate-300 hover:border-primary bg-white"
                    )}
                  >
                    {isAllSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <span className="text-sm font-semibold text-slate-700">
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-red-500 hover:bg-red-50 font-medium text-[11px] gap-2"
                  onClick={clearCart}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa tất cả
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.variantId}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    toggleSelectItem={toggleSelectItem}
                  />
                ))}
              </div>

              <div className="pt-6">
                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl px-6 h-12 font-medium text-sm group"
                >
                  <Link href={ROUTES.HOME} className="flex items-center gap-3">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <CartSummary
                selectedCount={selectedCount}
                selectedTotalPrice={selectedTotalPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
