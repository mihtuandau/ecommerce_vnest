"use client";

import React from "react";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";
import { Sparkles } from "lucide-react";

export function RecentlyViewedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const { recentlyViewed } = useRecentlyViewed();

  // Filter out current product and check if empty
  const items = recentlyViewed.filter((p) => String(p.id) !== currentProductId);

  if (items.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-[28px] font-bold text-primary tracking-tight">
            Sản phẩm vừa xem
          </h2>
          <p className="text-[13px] text-brand-taupe font-medium mt-0.5">
            Dựa trên lịch sử duyệt web của bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
