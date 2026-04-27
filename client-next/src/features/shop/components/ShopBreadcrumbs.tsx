"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface ShopBreadcrumbsProps {
  currentCategory: string | null;
  categories: any[];
}

export function ShopBreadcrumbs({ currentCategory, categories }: ShopBreadcrumbsProps) {
  return (
    <div className="py-4 md:py-6 overflow-hidden">
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar scroll-smooth">
        <Link href="/" className="hover:text-primary transition-all flex items-center gap-1 group whitespace-nowrap">
          <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
        <Link href="/shop" className={cn("whitespace-nowrap transition-colors", !currentCategory ? 'text-primary' : 'hover:text-primary')}>
          Cửa hàng
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
            <span className="text-primary font-bold whitespace-nowrap">
              {categories.find((c: any) => String(c.id) === currentCategory)?.name}
            </span>
          </>
        )}
      </nav>
    </div>
  );
}
