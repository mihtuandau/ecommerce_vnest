import type { Banner } from "@/types/models";

export type BannerListTab = "ALL" | "ACTIVE" | "INACTIVE";

export function normalizeBannerList(data: unknown): Banner[] {
  if (Array.isArray(data)) return data as Banner[];
  return ((data as any)?.data || []) as Banner[];
}

export function getBannerTabCounts(banners: Banner[]) {
  return {
    ALL: banners.length,
    ACTIVE: banners.filter((banner) => banner.isActive).length,
    INACTIVE: banners.filter((banner) => !banner.isActive).length,
  };
}

export function filterBanners(
  banners: Banner[],
  activeTab: BannerListTab,
  searchTerm: string
) {
  let result = banners;

  if (activeTab === "ACTIVE") {
    result = result.filter((banner) => banner.isActive);
  } else if (activeTab === "INACTIVE") {
    result = result.filter((banner) => !banner.isActive);
  }

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    result = result.filter((banner) =>
      banner.title?.toLowerCase().includes(lowerSearch)
    );
  }

  return result;
}
