"use client";

import React from "react";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";
import { SectionHeading } from "@/features/home/components/customer/shared/SectionHeading";

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
    <section className="space-y-10">
      <div className="space-y-3">
        <SectionHeading
          eyebrow="Lịch sử duyệt web"
          title="Sản phẩm vừa xem"
          accent="vừa xem"
        />
        <p className="text-brand-taupe text-sm max-w-md leading-relaxed">
          Dựa trên lịch sử duyệt web của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
