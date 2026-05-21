import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { productsApi } from "../../api";

export function useIncrementView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.incrementView(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
