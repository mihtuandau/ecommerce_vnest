"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { discountsApi } from "@/features/discounts/api";

export function useDiscounts(
  params?: Record<string, string | number | boolean>
) {
  return useQuery({
    queryKey: [...queryKeys.discounts.all, "public", params],
    queryFn: () => discountsApi.getDiscounts(params),
  });
}
