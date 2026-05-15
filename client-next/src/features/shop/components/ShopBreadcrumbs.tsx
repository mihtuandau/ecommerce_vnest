"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

import { Category } from "@/types/models";

interface ShopBreadcrumbsProps {
  currentCategory: string | null;
  categories: Category[];
}

export const ShopBreadcrumbs = React.memo(function ShopBreadcrumbs({ currentCategory, categories }: ShopBreadcrumbsProps) {
  const findCategoryPath = (allCats: Category[], targetId: string): Category[] => {
    for (const cat of allCats) {
      if (String(cat.id) === targetId) return [cat];
      if (cat.children) {
        const path = findCategoryPath(cat.children, targetId);
        if (path.length > 0) return [cat, ...path];
      }
    }
    return [];
  };

  const path = currentCategory ? findCategoryPath(categories, currentCategory) : [];

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest overflow-x-auto no-scrollbar scroll-smooth">
            <Link href="/" className="hover:text-primary transition-all flex items-center gap-1.5 group whitespace-nowrap">
              <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
            <Link href="/shop" className={cn("whitespace-nowrap transition-colors", path.length === 0 ? 'text-primary font-bold' : 'hover:text-primary')}>
              Cửa hàng
            </Link>
            {path.map((cat, index) => (
              <React.Fragment key={cat.id}>
                <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
                <Link 
                  href={`/shop?categoryId=${cat.id}`}
                  className={cn(
                    "whitespace-nowrap transition-colors",
                    index === path.length - 1 ? "text-primary font-bold" : "hover:text-primary"
                  )}
                >
                  {cat.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
});
