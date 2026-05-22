import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../api";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => productsApi.getBrands(),
  });
}
