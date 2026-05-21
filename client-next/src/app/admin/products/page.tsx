"use client";

import React from "react";
import { useProducts, useCategories } from "@/features/products/hooks";
import { ProductTable } from "@/features/products/components/admin/ProductTable";
import { Header } from "@/features/products/components/admin/ProductList/Header";
import { Tabs } from "@/features/products/components/admin/ProductList/Tabs";
import { Toolbar } from "@/features/products/components/admin/ProductList/Toolbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminProductsPage() {
  const { data, isLoading, refetch, isFetching } = useProducts({
    limit: 200,
    status: "all",
    sortBy: "newest",
  });
  const { data: categoryData } = useCategories();
  const categories = React.useMemo(() => {
    return Array.isArray(categoryData)
      ? categoryData
      : (categoryData as any)?.data || [];
  }, [categoryData]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [categoryId, setCategoryId] = React.useState("ALL");
  const [discountStatus, setDiscountStatus] = React.useState("ALL");
  const [sortBy, setSortBy] = React.useState("newest");

  const products = React.useMemo(() => {
    return data?.data || [];
  }, [data]);

  const counts = React.useMemo(
    () => ({
      ALL: products.length,
      ACTIVE: products.filter((p: any) => p.isActive).length,
      HIDDEN: products.filter((p: any) => !p.isActive).length,
      LOW_STOCK: products.filter((p: any) => {
        const stock =
          Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0)
            : p.stock || 0;
        return stock < 10 && stock > 0;
      }).length,
    }),
    [products]
  );

  const filteredProducts = React.useMemo(() => {
    let result = products;

    if (activeTab === "ACTIVE") result = result.filter((p: any) => p.isActive);
    else if (activeTab === "HIDDEN") result = result.filter((p: any) => !p.isActive);
    else if (activeTab === "LOW_STOCK")
      result = result.filter((p: any) => {
        const stock =
          Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0)
            : p.stock || 0;
        return stock < 10 && stock > 0;
      });

    if (categoryId !== "ALL") {
      result = result.filter((p: any) => p.categoryId === Number(categoryId));
    }

    if (discountStatus === "DISCOUNTED") {
      result = result.filter(
        (p: any) => p.originalPrice && p.originalPrice > p.basePrice
      );
    } else if (discountStatus === "NO_DISCOUNT") {
      result = result.filter(
        (p: any) => !p.originalPrice || p.originalPrice <= p.basePrice
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(lower) ||
          p.slug?.toLowerCase().includes(lower) ||
          p.category?.name?.toLowerCase().includes(lower)
      );
    }

    if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "sold_desc") {
      result = [...result].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    } else if (sortBy === "name_asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "oldest") {
      result = [...result].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, activeTab, searchTerm, categoryId, discountStatus, sortBy]);

  return (
    <div className="space-y-6 pb-10">
      <Header
        totalProducts={products.length}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          discountStatus={discountStatus}
          onDiscountStatusChange={setDiscountStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-slate-400">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : (
            <ProductTable data={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}