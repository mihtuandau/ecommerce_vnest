"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Product } from "@/types/models";

interface ProductBreadcrumbsProps {
  product: Product;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-50">
      <div className="py-4 md:py-6">
        <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider overflow-x-auto no-scrollbar scroll-smooth">
          <Link
            href="/"
            className="hover:text-primary transition-all flex items-center gap-1.5 group whitespace-nowrap"
          >
            <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
          <Link
            href="/shop"
            className="hover:text-primary transition-colors whitespace-nowrap"
          >
            Cửa hàng
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
              <Link
                href={`/shop?categoryId=${product.categoryId}`}
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
          <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>
    </div>
  );
}
