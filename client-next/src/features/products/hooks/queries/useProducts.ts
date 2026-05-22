import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { productsApi } from "../../api";

export function useProducts(
  params?: Record<string, string | number | boolean | undefined>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, string>),
    queryFn: () => productsApi.getProducts(params),
    ...options,
  });
}
