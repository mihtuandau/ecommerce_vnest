"use client";

import { useQuery } from "@tanstack/react-query";
import { discountsApi } from "@/features/discounts/api";

export function useFlashSale() {
  return useQuery({
    queryKey: ["discounts", "flash-sale"],
    queryFn: () => discountsApi.getFlashSale(),
  });
}
