"use client";

import React from "react";
import { useCategories } from "@/features/categories/hooks";
import { CategoryTable } from "@/features/categories/components/admin/CategoryTable";
import { CategoryListHeader } from "@/features/categories/components/admin/ListHeader";
import { CategoryTabs } from "@/features/categories/components/admin/Tabs";
import { CategoryListToolbar } from "@/features/categories/components/admin/ListToolbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminCategoriesPage() {
  const {
    data: categoryData,
    isLoading,
    refetch,
    isFetching,
  } = useCategories({ tree: true });
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Helper function to flatten the category tree for the table display
  const flattenedCategories = React.useMemo(() => {
    const categoriesArray = Array.isArray(categoryData)
      ? categoryData
      : (categoryData as any)?.data || [];
    const result: any[] = [];

    const flatten = (cats: any[], depth = 0, parent: any = null) => {
      cats.forEach((cat) => {
        const item = { ...cat, depth, parent: cat.parent || parent };
        result.push(item);
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, depth + 1, cat);
        }
      });
    };

    flatten(categoriesArray);
    return result;
  }, [categoryData]);

  const counts = React.useMemo(
    () => ({
      ALL: flattenedCategories.length,
    }),
    [flattenedCategories]
  );

  const filteredCategories = React.useMemo(() => {
    let result = flattenedCategories;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((c: any) => c.name?.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [flattenedCategories, searchTerm]);

  return (
    <div className="space-y-4 pb-10">
      <CategoryListHeader
        totalCategories={flattenedCategories.length}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
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
