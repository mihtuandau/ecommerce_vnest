"use client";

import React from "react";
import { useProducts } from "@/features/products/hooks";
import { ProductTable } from "@/features/products/components/admin/ProductTable";
import { Header } from "@/features/products/components/admin/ProductList/Header";
import { Tabs } from "@/features/products/components/admin/ProductList/Tabs";
import { Toolbar } from "@/features/products/components/admin/ProductList/Toolbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminProductsPage() {
  const { data, isLoading, refetch, isFetching } = useProducts({ limit: 200, status: 'all', sortBy: 'newest' });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("ALL");

  const products = React.useMemo(() => {
    return data?.data || [];
  }, [data]);

  const counts = React.useMemo(() => ({
    ALL: products.length,
    ACTIVE: products.filter((p: any) => p.isActive).length,
    HIDDEN: products.filter((p: any) => !p.isActive).length,
    LOW_STOCK: products.filter((p: any) => {
      const stock = Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0)
        : (p.stock || 0);
      return stock < 10 && stock > 0;
    }).length,
  }), [products]);

  const filteredProducts = React.useMemo(() => {
    let result = products;

    if (activeTab === "ACTIVE") result = result.filter((p: any) => p.isActive);
    else if (activeTab === "HIDDEN") result = result.filter((p: any) => !p.isActive);
    else if (activeTab === "LOW_STOCK") result = result.filter((p: any) => {
      const stock = Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0)
        : (p.stock || 0);
      return stock < 10 && stock > 0;
    });

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((p: any) =>
        p.name?.toLowerCase().includes(lower) ||
        p.slug?.toLowerCase().includes(lower) ||
        p.category?.name?.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [products, activeTab, searchTerm]);

  return (
    <div className="space-y-6 pb-10">
      <Header 
        totalProducts={products.length} 
        onRefresh={refetch} 
        isFetching={isFetching} 
      />

      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        <Tabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts} 
        />

        <Toolbar 
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
            <ProductTable data={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}
