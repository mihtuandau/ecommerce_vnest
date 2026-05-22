import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/index";
import type { ReportQueryParams } from "@/features/reports/types";

export function useReportSummary(params?: ReportQueryParams) {
  return useQuery({
    queryKey: ["reports", "summary", params],
    queryFn: () => reportsApi.getSummary(params),
  });
}
