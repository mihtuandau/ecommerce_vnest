import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/index";
import type { ReportQueryParams } from "@/features/reports/types";

export function useTopProducts(params?: ReportQueryParams) {
  return useQuery({
    queryKey: ["reports", "top-products", params],
    queryFn: () => reportsApi.getTopProducts(params),
  });
}
