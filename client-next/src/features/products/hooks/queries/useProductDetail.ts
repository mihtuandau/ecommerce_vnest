import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { productsApi } from "../../api";

export function useProductDetail(slugOrId: string, allVariants = false) {
  return useQuery({
    queryKey: [...queryKeys.products.detail(String(slugOrId)), allVariants],
    queryFn: () => productsApi.getProduct(slugOrId, allVariants),
    enabled: !!slugOrId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}
