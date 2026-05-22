import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { productsApi } from "../../api";

export function useCategories(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.categories.all, params],
    queryFn: () => productsApi.getCategories(params),
  });
}
