"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/utils/cn";
import { Category } from "@/types/models";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

interface ShopBreadcrumbsProps {
  currentCategory: string | null;
  categories: Category[];
}

export const ShopBreadcrumbs = React.memo(function ShopBreadcrumbs({
  currentCategory,
  categories,
}: ShopBreadcrumbsProps) {
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
    <div className="bg-white border-b border-brand-sand/40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Breadcrumb>
            <BreadcrumbList className="text-[11.5px] uppercase tracking-widest">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5 hover:text-primary transition-all">
                    <Home className="h-3.5 w-3.5" />
                    <span>Trang chủ</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {path.length === 0 ? (
                  <BreadcrumbPage className="text-primary font-bold">Cửa hàng</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href="/shop" className="hover:text-primary transition-colors">
                      Cửa hàng
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {path.map((cat, index) => {
                const isLast = index === path.length - 1;
                return (
                  <React.Fragment key={cat.id}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-primary font-bold">{cat.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={`/shop?categoryId=${cat.id}`} className="hover:text-primary transition-colors">
                            {cat.name}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
});
