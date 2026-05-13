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
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";

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
  const selectedTotalSavings = selectedItems.reduce((sum, item) => {
    const currentPrice = item.discountedPrice || item.price;
    const oldPrice = item.originalPrice || (item.discountedPrice ? item.price : 0);
    const savings = oldPrice > currentPrice ? oldPrice - currentPrice : 0;
    return sum + (savings * item.quantity);
  }, 0);
  const isAllSelected = items.length > 0 && items.every((i) => i.selected);

  // Discount Logic
  const { appliedDiscount, setAppliedDiscount } = useCartStore();
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { success, error, warning } = useToast();

  const calculateDiscountAmount = React.useCallback((discount: any, totalVal: number) => {
    let saving = 0;
    const isPercentage = discount.discountType === "PERCENTAGE";
    const val = discount.discountValue || 0;

    if (isPercentage) {
      saving = Math.round((totalVal * val) / 100);
      if (discount.maxDiscountAmount && saving > discount.maxDiscountAmount) {
        saving = discount.maxDiscountAmount;
      }
    } else {
      saving = val;
    }
    return Math.min(saving, totalVal);
  }, []);

  const handleApplyDiscount = async (codeToValidate: string) => {
    if (!codeToValidate) return;
    setIsApplyingDiscount(true);
    try {
      const res: any = await discountsApi.validateDiscount(codeToValidate);
      if (!res.isValid) {
        warning(res.message || "Mã giảm giá không hợp lệ");
        return;
      }
      const discount = res.discount;
      if (discount.minOrderAmount && selectedTotalPrice < discount.minOrderAmount) {
        warning(`Mã chỉ áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(discount.minOrderAmount)}đ`);
        return;
      }

      const saving = calculateDiscountAmount(discount, selectedTotalPrice);
      setDiscountCode(codeToValidate);
      setAppliedDiscount({ ...discount, code: codeToValidate });
      setDiscountAmount(saving);
      success(`Đã áp dụng mã giảm giá: -${new Intl.NumberFormat('vi-VN').format(saving)}đ`);
    } catch (err: unknown) {
      error("Mã giảm giá không hợp lệ");
      setAppliedDiscount(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode("");
    success("Đã gỡ mã giảm giá");
  };

  useEffect(() => {
    if (appliedDiscount) {
      if (appliedDiscount.minOrderAmount && selectedTotalPrice < appliedDiscount.minOrderAmount) {
        setAppliedDiscount(null);
        setDiscountAmount(0);
        warning(`Đã gỡ mã giảm giá vì đơn hàng không đủ ${new Intl.NumberFormat('vi-VN').format(appliedDiscount.minOrderAmount)}đ`);
      } else {
        setDiscountAmount(calculateDiscountAmount(appliedDiscount, selectedTotalPrice));
      }
    }
  }, [selectedTotalPrice, appliedDiscount, calculateDiscountAmount, setAppliedDiscount, warning]);

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
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Giỏ hàng <span className="text-xl text-slate-400 font-medium ml-1">({items.length} sản phẩm)</span>
            </h1>
            <button
              className="text-slate-500 hover:text-rose-600 font-semibold text-sm transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50"
              onClick={clearCart}
            >
              <Trash2 size={16} /> Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Select All Card */}
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center justify-between shadow-sm">
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
                  <span className="text-[15px] font-semibold text-slate-900">
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </div>
              </div>

              {/* Shop Block */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Shop Header */}
                <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Minh Tuấn Store</span>
                      <span className="bg-amber-100 text-amber-700 text-[11px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <svg className="w-3 h-3 fill-amber-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        5.0
                      </span>
                    </div>
                  </div>
                  <button className="text-primary text-[13px] font-semibold hover:underline flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat
                  </button>
                </div>

                {/* Items */}
                <div className="px-5">
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


              </div>

              <div className="pt-6">
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary hover:bg-primary/5 rounded-xl px-6 h-10 font-bold text-sm group"
                >
                  <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4">
              <CartSummary
                selectedCount={selectedCount}
                selectedTotalPrice={selectedTotalPrice}
                selectedTotalSavings={selectedTotalSavings}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                appliedDiscount={appliedDiscount}
                discountAmount={discountAmount}
                isApplyingDiscount={isApplyingDiscount}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
