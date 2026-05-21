import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/index";
import type { ReportQueryParams } from "@/features/reports/types";

export function useRevenueReport(params?: ReportQueryParams) {
  return useQuery({
    queryKey: ["reports", "revenue", params],
    queryFn: () => reportsApi.getRevenue(params),
  });
}
