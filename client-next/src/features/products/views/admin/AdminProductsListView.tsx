"use client";

import React from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Header } from "@/features/products/components/admin/list/ProductsHeader";
import { ProductTable } from "@/features/products/components/admin/list/ProductsTable";
import { Tabs } from "@/features/products/components/admin/list/ProductsTabs";
import { Toolbar } from "@/features/products/components/admin/list/ProductsToolbar";
import { useCategories, useProducts } from "@/features/products/hooks";
import {
  getAdminProductCounts,
  getFilteredAdminProducts,
} from "@/features/products/services";

export function AdminProductsListView() {
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

  const products = React.useMemo(() => data?.data || [], [data]);

  const counts = React.useMemo(() => getAdminProductCounts(products), [products]);

  const filteredProducts = React.useMemo(() => {
    return getFilteredAdminProducts(products, {
      activeTab,
      searchTerm,
      categoryId,
      discountStatus,
      sortBy,
    });
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
