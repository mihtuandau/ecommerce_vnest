"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Product } from "@/types/models";

interface ProductBreadcrumbsProps {
  product: Product;
}

export const ProductBreadcrumbs = React.memo(function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-brand-taupe">
          <Link href="/" className="hover:text-brand-espresso transition-colors">Trang chủ</Link>
          <span className="opacity-50 text-[10px]">›</span>
          <Link href="/shop" className="hover:text-brand-espresso transition-colors">Cửa hàng</Link>
          {product.category && (
            <>
              <span className="opacity-50 text-[10px]">›</span>
              <Link
                href={`/shop?categoryId=${product.categoryId}`}
                className="hover:text-brand-espresso transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="opacity-50 text-[10px]">›</span>
          <span className="text-brand-espresso font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
    </div>
  );
});
