"use client";

import React from "react";
import { useBanners } from "@/features/banners/hooks";
import { BannerTable } from "@/features/banners/components/admin/BannerTable";
import { BannerListHeader } from "@/features/banners/components/admin/list/ListHeader";
import { BannerTabs } from "@/features/banners/components/admin/list/Tabs";
import { BannerListToolbar } from "@/features/banners/components/admin/list/ListToolbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminBannersPage() {
  const { data, isLoading, refetch, isFetching } = useBanners();
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  const banners = Array.isArray(data) ? data : (data as any)?.data || [];

  const counts = React.useMemo(
    () => ({
      ALL: banners.length,
      ACTIVE: banners.filter((b: any) => b.isActive).length,
      INACTIVE: banners.filter((b: any) => !b.isActive).length,
    }),
    [banners]
  );

  const filteredBanners = React.useMemo(() => {
    let result = banners;

    if (activeTab === "ACTIVE") {
      result = result.filter((b: any) => b.isActive);
    } else if (activeTab === "INACTIVE") {
      result = result.filter((b: any) => !b.isActive);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((b: any) => b.title?.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [banners, activeTab, searchTerm]);

  return (
    <div className="space-y-4 pb-10">
      <BannerListHeader
        totalBanners={banners.length}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <BannerTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        <BannerListToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
            <BannerTable data={filteredBanners} />
          )}
        </div>
      </div>
    </div>
  );
}
