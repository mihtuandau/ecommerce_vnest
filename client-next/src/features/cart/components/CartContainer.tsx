"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Check, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";
import { Checkbox } from "@/components/ui/Checkbox";

import { EmptyCart } from "./EmptyCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "../hooks";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";
import { CheckoutSteps } from "@/features/checkout/components/CheckoutSteps";

interface RecentlyViewedSectionProps {
  recentlyViewed: any[];
}

function RecentlyViewedSection({ recentlyViewed }: RecentlyViewedSectionProps) {
  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mt-20 border-t border-brand-sand/50 pt-16">
      <h3 className="text-xl font-bold text-[#3D2B1A] font-serif mb-10 flex items-center gap-4">
        Bạn đã <span className="text-[#C4783A] italic font-medium">xem gần đây</span>
        <div className="h-[1px] flex-1 bg-brand-sand/30" />
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {recentlyViewed.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function CartContainer() {
  const router = useRouter();
  const { recentlyViewed } = useRecentlyViewed();
  const { items, updateQuantity, removeItem } = useCart();
  const { toggleSelectItem, toggleSelectAll, appliedDiscount, setAppliedDiscount } =
    useCartStore();
  const [mounted, setMounted] = useState(false);
  const { success, error, warning } = useToast();

  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedItems = items.filter((i) => i.selected);
  const selectedCount = selectedItems.length;
  const selectedTotalPrice = selectedItems.reduce(
    (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
    0
  );
  const isAllSelected = items.length > 0 && items.every((i) => i.selected);

  const calculateDiscountAmount = React.useCallback(
    (discount: any, totalVal: number) => {
      let saving = 0;
      const isPercentage =
        discount.discountType === "PERCENTAGE" || !!discount.percentage;
      const val =
        discount.discountValue || discount.percentage || discount.fixedAmount || 0;
      if (isPercentage) {
        saving = Math.round((totalVal * val) / 100);
        if (discount.maxDiscountAmount && saving > discount.maxDiscountAmount)
          saving = discount.maxDiscountAmount;
      } else {
        saving = val;
      }
      return Math.min(saving, totalVal);
    },
    []
  );

  const handleApplyDiscount = async (code: string) => {
    if (!code) return;
    setIsApplyingDiscount(true);
    try {
      const res: any = await discountsApi.validateDiscount(code);
      if (!res.isValid) {
        warning(res.message || "Mã không hợp lệ");
        return;
      }
      const discount = res.discount;
      if (discount.minOrderAmount && selectedTotalPrice < discount.minOrderAmount) {
        warning(`Mã chỉ áp dụng cho đơn từ ${formatCurrency(discount.minOrderAmount)}`);
        return;
      }
      const saving = calculateDiscountAmount(discount, selectedTotalPrice);
      setAppliedDiscount({ ...discount, code });
      setDiscountAmount(saving);
      success(`Đã áp dụng mã: -${formatCurrency(saving)}`);
    } catch (err) {
      error("Mã không hợp lệ");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    success("Đã gỡ mã giảm giá");
  };

  useEffect(() => {
    if (appliedDiscount) {
      if (
        appliedDiscount.minOrderAmount &&
        selectedTotalPrice < appliedDiscount.minOrderAmount
      ) {
        setAppliedDiscount(null);
        setDiscountAmount(0);
        warning(
          `Đã gỡ mã giảm giá vì đơn không đủ ${formatCurrency(appliedDiscount.minOrderAmount)}`
        );
      } else {
        setDiscountAmount(calculateDiscountAmount(appliedDiscount, selectedTotalPrice));
      }
    }
  }, [
    selectedTotalPrice,
    appliedDiscount,
    calculateDiscountAmount,
    setAppliedDiscount,
    warning,
  ]);

  if (!mounted)
    return (
      <div className="min-h-screen bg-brand-cream pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-20 w-full rounded-full" />
        </div>
      </div>
    );
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24 font-sans-brand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[13px] text-brand-taupe hover:text-brand-espresso transition-colors mb-10 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Quay lại</span>
        </button>

        <div className="max-w-3xl mx-auto mb-16">
          <CheckoutSteps currentStep={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-brand-sand">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-espresso font-serif-brand leading-none tracking-tight">
                Giỏ hàng{" "}
                <em className="italic text-brand-bronze font-medium font-serif-brand">
                  của bạn
                </em>
                <span className="text-[14px] font-medium text-brand-taupe ml-2">
                  ({items.length} sản phẩm)
                </span>
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={() => toggleSelectAll(!isAllSelected)}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-[13px] font-bold text-brand-espresso cursor-pointer select-none"
                  >
                    Chọn tất cả
                  </label>
                </div>
                <div className="w-[1px] h-3.5 bg-brand-sand" />
                <button
                  className="text-[13px] font-bold text-brand-taupe hover:text-red-500 transition-colors flex items-center gap-1.5"
                  onClick={() => {
                    const selectedIds = items.reduce<string[]>((acc, i) => {
                      if (i.selected) acc.push(i.variantId);
                      return acc;
                    }, []);
                    if (selectedIds.length === 0) {
                      warning("Vui lòng chọn sản phẩm cần xóa");
                      return;
                    }
                    selectedIds.forEach((id) => removeItem(id));
                    success("Đã xóa các sản phẩm đã chọn");
                  }}
                >
                  <Trash2 size={16} /> Xoá đã chọn
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {(() => {
                const groups = items.reduce(
                  (acc: { [key: string]: typeof items }, item) => {
                    const key = item.productId || item.name;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                  },
                  {}
                );

                return Object.entries(groups).map(([key, groupItems]) => (
                  <div
                    key={key}
                    className="bg-white rounded-[24px] border border-brand-sand shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-espresso/5"
                  >
                    <div className="px-6 py-4 border-b border-brand-cream bg-brand-cream/30">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-brand-espresso rounded-full" />
                        <h3 className="font-serif font-bold text-brand-espresso text-[15px] leading-snug tracking-tight">
                          {groupItems[0].name}
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-brand-cream">
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

        {mounted && <RecentlyViewedSection recentlyViewed={recentlyViewed} />}
      </div>
    </div>
  );
}
