"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CheckoutSteps } from "@/features/checkout/components/CheckoutSteps";
import { CartItemsList } from "@/features/cart/components/CartItemsList";
import { CartLoadingSkeleton } from "@/features/cart/components/CartLoadingSkeleton";
import { CartPageHeader } from "@/features/cart/components/CartPageHeader";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { EmptyCart } from "@/features/cart/components/EmptyCart";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCartDiscount } from "@/features/cart/hooks/useCartDiscount";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/store/useCartStore";
import {
  areAllCartItemsSelected,
  calculateSelectedCartTotal,
  getSelectedCartItems,
} from "@/features/cart/services/cart-calculator.service";

const RecentlyViewedSection = dynamic(() =>
  import("@/features/cart/components/RecentlyViewedSection").then(
    (mod) => mod.RecentlyViewedSection
  )
);

export function CartView() {
  const router = useRouter();
  const { recentlyViewed } = useRecentlyViewed();
  const { items, updateQuantity, removeItem } = useCart();
  const { toggleSelectItem, toggleSelectAll } = useCartStore();
  const { success, warning } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const selectedItems = React.useMemo(() => getSelectedCartItems(items), [items]);
  const selectedCount = selectedItems.length;
  const selectedTotalPrice = React.useMemo(
    () => calculateSelectedCartTotal(items),
    [items]
  );
  const isAllSelected = areAllCartItemsSelected(items);

  const {
    appliedDiscount,
    discountAmount,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
  } = useCartDiscount(selectedTotalPrice);

  const handleRemoveSelected = React.useCallback(() => {
    const selectedIds = items
      .filter((item) => item.selected)
      .map((item) => item.variantId);

    if (selectedIds.length === 0) {
      warning("Vui lòng chọn sản phẩm cần xóa");
      return;
    }

    selectedIds.forEach((id) => removeItem(id));
    success("Đã xóa các sản phẩm đã chọn");
  }, [items, removeItem, success, warning]);

  if (!mounted) return <CartLoadingSkeleton />;
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
            <CartPageHeader
              itemCount={items.length}
              isAllSelected={isAllSelected}
              onToggleSelectAll={() => toggleSelectAll(!isAllSelected)}
              onRemoveSelected={handleRemoveSelected}
            />

            <CartItemsList
              items={items}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              toggleSelectItem={toggleSelectItem}
            />
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

        <RecentlyViewedSection recentlyViewed={recentlyViewed} />
      </div>
    </div>
  );
}
