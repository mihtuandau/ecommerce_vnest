import { useQuery } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns/api/index";
import { returnQueryKeys } from "./useReturns";

export function useReturnDetail(id: number) {
  return useQuery({
    queryKey: returnQueryKeys.detail(id),
    queryFn: () => returnsApi.getReturnDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
