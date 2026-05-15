"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";

// Sub-components
import { EmptyCart } from "./EmptyCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "../hooks";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";



function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "Giỏ hàng" },
    { id: 2, label: "Thanh toán" },
    { id: 3, label: "Xác nhận" },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative group">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                currentStep >= step.id 
                  ? "bg-[#3D2B1A] text-white shadow-lg shadow-[#3D2B1A]/20 scale-110" 
                  : "bg-white border border-[#DDD6C8] text-[#8A7966]"
              )}>
                {currentStep > step.id ? <Check size={16} strokeWidth={3} /> : step.id}
              </div>
              <span className={cn(
                "absolute -bottom-6 whitespace-nowrap text-[12px] font-bold tracking-tight transition-colors",
                currentStep >= step.id ? "text-[#3D2B1A]" : "text-[#8A7966]"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-4 bg-[#DDD6C8] relative">
                <div className={cn(
                  "absolute inset-0 bg-[#3D2B1A] transition-transform duration-700 origin-left",
                  currentStep > step.id ? "scale-x-100" : "scale-x-0"
                )} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function CartContainer() {
  const { recentlyViewed } = useRecentlyViewed();

  function RecentlyViewedSection() {
    if (recentlyViewed.length === 0) return null;

    return (
      <div className="mt-12 border-t border-[#DDD6C8] pt-10">
        <h3 className="text-xl font-bold text-[#3D2B1A] font-serif mb-8 flex items-center gap-3">
          Bạn đã <span className="text-[#C4783A] italic font-medium">xem gần đây</span>
          <div className="h-[1px] flex-1 bg-[#F3EFE8]" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyViewed.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { toggleSelectItem, toggleSelectAll, appliedDiscount, setAppliedDiscount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { success, error, warning } = useToast();

  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const selectedItems = items.filter(i => i.selected);
  const selectedCount = selectedItems.length;
  const selectedTotalPrice = selectedItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
  const isAllSelected = items.length > 0 && items.every((i) => i.selected);

  const calculateDiscountAmount = React.useCallback((discount: any, totalVal: number) => {
    let saving = 0;
    const isPercentage = discount.discountType === "PERCENTAGE" || !!discount.percentage;
    const val = discount.discountValue || discount.percentage || discount.fixedAmount || 0;
    if (isPercentage) {
      saving = Math.round((totalVal * val) / 100);
      if (discount.maxDiscountAmount && saving > discount.maxDiscountAmount) saving = discount.maxDiscountAmount;
    } else { saving = val; }
    return Math.min(saving, totalVal);
  }, []);

  const handleApplyDiscount = async (code: string) => {
    if (!code) return;
    setIsApplyingDiscount(true);
    try {
      const res: any = await discountsApi.validateDiscount(code);
      if (!res.isValid) { warning(res.message || "Mã không hợp lệ"); return; }
      const discount = res.discount;
      if (discount.minOrderAmount && selectedTotalPrice < discount.minOrderAmount) {
        warning(`Mã chỉ áp dụng cho đơn từ ${formatCurrency(discount.minOrderAmount)}`);
        return;
      }
      const saving = calculateDiscountAmount(discount, selectedTotalPrice);
      setAppliedDiscount({ ...discount, code });
      setDiscountAmount(saving);
      success(`Đã áp dụng mã: -${formatCurrency(saving)}`);
    } catch (err) { error("Mã không hợp lệ"); } finally { setIsApplyingDiscount(false); }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    success("Đã gỡ mã giảm giá");
  };

  useEffect(() => {
    if (appliedDiscount) {
      if (appliedDiscount.minOrderAmount && selectedTotalPrice < appliedDiscount.minOrderAmount) {
        setAppliedDiscount(null); setDiscountAmount(0);
        warning(`Đã gỡ mã giảm giá vì đơn không đủ ${formatCurrency(appliedDiscount.minOrderAmount)}`);
      } else {
        setDiscountAmount(calculateDiscountAmount(appliedDiscount, selectedTotalPrice));
      }
    }
  }, [selectedTotalPrice, appliedDiscount, calculateDiscountAmount, setAppliedDiscount, warning]);

  if (!mounted) return <div className="min-h-screen bg-[#FAF8F4] pt-12 pb-24"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><Skeleton className="h-20 w-full rounded-full" /></div></div>;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="bg-[#FAF8F4] min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps currentStep={1} />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#3D2B1A] font-serif leading-none tracking-tight">
              Giỏ hàng <span className="text-[#C4783A] italic font-medium">của bạn</span>
              <span className="text-[11px] font-black text-[#8A7966] ml-4 bg-[#F3EFE8] px-2.5 py-1 rounded-full tracking-[0.1em] uppercase">
                {items.length} SẢN PHẨM
              </span>
            </h1>
            <div className="flex items-center gap-6">
              <button onClick={() => toggleSelectAll(!isAllSelected)} className="flex items-center gap-2 text-[13px] font-bold text-[#3D2B1A] group">
                <div className={cn("w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all", isAllSelected ? "bg-[#3D2B1A] border-[#3D2B1A] text-white" : "border-[#DDD6C8] bg-white group-hover:border-[#3D2B1A]")}>
                  {isAllSelected && <Check size={10} strokeWidth={4} />}
                </div>
                Chọn tất cả
              </button>
              <div className="w-[1px] h-3.5 bg-[#DDD6C8]" />
              <button className="text-[13px] font-bold text-[#8A7966] hover:text-red-500 transition-colors flex items-center gap-1.5" onClick={clearCart}><Trash2 size={16} /> Xoá tất cả</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              {(() => {
                const groups = items.reduce((acc: { [key: string]: typeof items }, item) => {
                  const key = item.productId || item.name; // Fallback to name if productId is missing
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {});

                return Object.entries(groups).map(([key, groupItems]) => (
                  <div key={key} className="bg-white rounded-[2rem] border border-[#DDD6C8] shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="px-6 py-4 border-b border-[#F3EFE8] bg-[#FAF8F4]/30">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-[#3D2B1A] rounded-full" />
                        <h3 className="font-serif font-semibold text-[#3D2B1A] text-[15px] leading-snug tracking-tight">
                          {groupItems[0].name}
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-[#F3EFE8]/80">
                      {groupItems.map((item) => (
                        <CartItem 
                          key={item.variantId} 
                          item={item} 
                          updateQuantity={updateQuantity} 
                          removeItem={removeItem} 
                          toggleSelectItem={toggleSelectItem} 
                          isGrouped 
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="lg:col-span-4 sticky top-40">
              <CartSummary
                selectedCount={selectedCount}
                selectedTotalPrice={selectedTotalPrice}
                appliedDiscount={appliedDiscount}
                discountAmount={discountAmount}
                isApplyingDiscount={isApplyingDiscount}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
              />
            </div>
          </div>

          {mounted && (
            <RecentlyViewedSection />
          )}
        </div>
      </div>
    </div>
  );
}
