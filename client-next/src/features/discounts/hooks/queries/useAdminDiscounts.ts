"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { discountsApi } from "@/features/discounts/api";

export function useAdminDiscounts(
  params?: Record<string, string | number | boolean>
) {
  return useQuery({
    queryKey: [...queryKeys.discounts.all, "admin", params],
    queryFn: () => discountsApi.getDiscounts({ ...params, manage: true }),
  });
}
