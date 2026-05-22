"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/categories/api";

export function useCategoryDetail(id: string | number) {
  return useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });
}
