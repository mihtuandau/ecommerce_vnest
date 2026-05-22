import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { paymentsApi } from "@/features/payments/api/index";
import type { PaymentsQueryParams } from "@/features/payments/types";

export function usePayments(params?: PaymentsQueryParams) {
  return useQuery({
    queryKey: [...queryKeys.payments.all, params],
    queryFn: () => paymentsApi.getPayments(params),
  });
}
