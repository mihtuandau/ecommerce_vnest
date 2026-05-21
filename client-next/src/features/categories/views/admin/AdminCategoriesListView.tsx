"use client";

import React from "react";
import { Spinner } from "@/components/ui/Spinner";
import {
  CategoryListHeader,
  CategoryListToolbar,
  CategoryTable,
  CategoryTabs,
} from "@/features/categories/components/admin";
import { useCategories } from "@/features/categories/hooks";
import {
  filterCategories,
  flattenCategoryTree,
  normalizeCategories,
} from "@/features/categories/services";
import type { CategoryTab } from "@/features/categories/types";

export function AdminCategoriesListView() {
  const {
    data: categoryData,
    isLoading,
    refetch,
    isFetching,
  } = useCategories({ tree: true });
  const [activeTab, setActiveTab] = React.useState<CategoryTab>("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  const flattenedCategories = React.useMemo(
    () => flattenCategoryTree(normalizeCategories(categoryData)),
    [categoryData]
  );

  const counts = React.useMemo(
    () => ({
      ALL: flattenedCategories.length,
    }),
    [flattenedCategories]
  );

  const filteredCategories = React.useMemo(
    () => filterCategories(flattenedCategories, searchTerm),
    [flattenedCategories, searchTerm]
  );

  return (
    <div className="space-y-4 pb-10">
      <CategoryListHeader
        totalCategories={flattenedCategories.length}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        <CategoryTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        <CategoryListToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
            <CategoryTable data={filteredCategories} />
          )}
        </div>
      </div>
    </div>
  );
}
