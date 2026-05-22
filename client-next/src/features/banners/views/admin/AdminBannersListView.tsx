"use client";

import React from "react";
import { Spinner } from "@/components/ui/Spinner";
import {
  BannerListHeader,
  BannerListToolbar,
  BannerTable,
  BannerTabs,
} from "@/features/banners/components/admin";
import { useBanners } from "@/features/banners/hooks";
import {
  filterBanners,
  getBannerTabCounts,
  normalizeBannerList,
  type BannerListTab,
} from "@/features/banners/services";

export function AdminBannersListView() {
  const { data, isLoading, refetch, isFetching } = useBanners();
  const [activeTab, setActiveTab] = React.useState<BannerListTab>("ALL");
  const [searchTerm, setSearchTerm] = React.useState("");

  const banners = React.useMemo(() => normalizeBannerList(data), [data]);
  const counts = React.useMemo(() => getBannerTabCounts(banners), [banners]);
  const filteredBanners = React.useMemo(
    () => filterBanners(banners, activeTab, searchTerm),
    [banners, activeTab, searchTerm]
  );

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
