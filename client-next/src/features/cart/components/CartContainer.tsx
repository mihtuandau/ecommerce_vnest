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
  
  const { toggleSelectItem, toggleSelectAll } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedItems = items.filter(i => i.selected);
  const selectedCount = selectedItems.length;
  const selectedTotalPrice = selectedItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
  const isAllSelected = items.length > 0 && items.every((i) => i.selected);

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-10 w-64" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-96 w-full rounded-3xl" />
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
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Giỏ hàng</h1>
            <p className="text-slate-400 text-sm font-medium">Bạn đang có {items.length} sản phẩm trong giỏ hàng</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Product List */}
            <div className="lg:col-span-7">
              {/* Subtle Select All Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelectAll(!isAllSelected)}
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                      isAllSelected
                        ? "bg-primary border-primary text-white"
                        : "border-slate-200 hover:border-primary bg-white"
                    )}
                  >
                    {isAllSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <span className="text-sm font-bold text-slate-900">
                    Chọn tất cả
                  </span>
                </div>
                <button
                  className="text-slate-400 hover:text-rose-500 font-bold text-xs transition-colors"
                  onClick={clearCart}
                >
                  Xóa toàn bộ
                </button>
              </div>

              <div className="divide-y divide-slate-100">
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

              <div className="pt-10">
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary hover:bg-primary/5 rounded-full px-8 h-12 font-bold text-xs group"
                >
                  <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-5">
              <CartSummary
                selectedCount={items.filter((i) => i.selected).length}
                selectedTotalPrice={selectedTotalPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
