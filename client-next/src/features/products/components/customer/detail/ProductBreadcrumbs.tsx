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
    <div className="bg-white border-b border-[#DDD6C8] mb-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-11 flex items-center">
          <nav className="flex items-center gap-3 text-[12px] font-medium overflow-x-auto no-scrollbar scroll-smooth">
            <Link
              href="/"
              className="text-[#8A7966] hover:text-[#3D2B1A] transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              <Home size={14} className="group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight size={12} className="text-[#DDD6C8] shrink-0" />
            <Link
              href="/shop"
              className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors whitespace-nowrap"
            >
              Cửa hàng
            </Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="text-[#DDD6C8] shrink-0" />
                <Link
                  href={`/shop?categoryId=${product.categoryId}`}
                  className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors whitespace-nowrap"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} className="text-[#DDD6C8] shrink-0" />
            <span className="text-[#3D2B1A] font-semibold whitespace-nowrap truncate max-w-[250px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
});
