"use client";

import React from "react";
import { ShopProductsGrid } from "@/features/products/components/customer/shop/ShopProductsGrid";
import { Product } from "@/types/models";
import { Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sản phẩm nổi bật
            </h2>
            <p className="text-slate-500 text-sm">Gợi ý dành riêng cho bạn hôm nay.</p>
          </div>
        </div>
      </div>

      <ShopProductsGrid initialProducts={products} />
    </div>
  );
}
