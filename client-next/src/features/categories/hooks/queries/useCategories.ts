"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { categoriesApi } from "@/features/categories/api";

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, params],
    queryFn: () => categoriesApi.getCategories(params),
  });
}
