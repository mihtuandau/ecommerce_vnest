"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/models";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

interface ProductBreadcrumbsProps {
  product: Product;
}

export const ProductBreadcrumbs = React.memo(function ProductBreadcrumbs({
  product,
}: ProductBreadcrumbsProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <Breadcrumb>
        <BreadcrumbList className="text-sm font-medium">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Cửa hàng</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/shop?categoryId=${product.categoryId}`}>
                    {product.category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
});
