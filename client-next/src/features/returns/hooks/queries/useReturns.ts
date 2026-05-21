import { useQuery } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns/api/index";
import type { ReturnsQueryParams } from "@/features/returns/types";

export const returnQueryKeys = {
  all: ["returns"] as const,
  list: (params: ReturnsQueryParams) => ["returns", "list", params] as const,
  detail: (id: number) => ["returns", "detail", id] as const,
};

export function useReturns(params: ReturnsQueryParams = {}) {
  return useQuery({
    queryKey: returnQueryKeys.list(params),
    queryFn: () => returnsApi.getAllReturns(params),
  });
}
