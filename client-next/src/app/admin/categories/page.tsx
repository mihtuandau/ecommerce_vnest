"use client";

import React from "react";
import { useCategories } from "@/features/categories/hooks";
import { CategoryTable } from "@/features/categories/components/admin/CategoryTable";
import { CategoryListHeader } from "@/features/categories/components/admin/ListHeader";
import { CategoryTabs } from "@/features/categories/components/admin/Tabs";
import { CategoryListToolbar } from "@/features/categories/components/admin/ListToolbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminCategoriesPage() {
  const { data, isLoading, refetch, isFetching } = useCategories();
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  const categories = data || [];

  const counts = React.useMemo(() => ({
    ALL: categories.length,
  }), [categories]);

  const filteredCategories = React.useMemo(() => {
    let result = categories;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((c: any) => 
        c.name?.toLowerCase().includes(lowerSearch)
      );
    }

    return result;
  }, [categories, searchTerm]);

  return (
    <div className="space-y-4 pb-10">
      <CategoryListHeader 
        totalCategories={categories.length} 
        onRefresh={refetch} 
        isFetching={isFetching} 
      />

      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        <CategoryTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts} 
        />

        <CategoryListToolbar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-slate-400">Đang tải dữ liệu...</p>
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
