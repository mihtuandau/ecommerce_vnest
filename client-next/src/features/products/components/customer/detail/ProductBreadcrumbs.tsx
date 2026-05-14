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
    <div className="bg-white border-b border-brand-sand mb-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-11 flex items-center">
          <nav className="flex items-center gap-3 text-[12px] font-medium overflow-x-auto no-scrollbar scroll-smooth">
            <Link
              href="/"
              className="text-brand-taupe hover:text-primary transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              <Home size={14} className="group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight size={12} className="text-brand-sand shrink-0" />
            <Link
              href="/shop"
              className="text-brand-taupe hover:text-primary transition-colors whitespace-nowrap"
            >
              Cửa hàng
            </Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="text-brand-sand shrink-0" />
                <Link
                  href={`/shop?categoryId=${product.categoryId}`}
                  className="text-brand-taupe hover:text-primary transition-colors whitespace-nowrap"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} className="text-brand-sand shrink-0" />
            <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[250px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
});
