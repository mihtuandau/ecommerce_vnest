"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../../api/orders.api";

export function useOrdersStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: () => ordersApi.getStats(),
  });
}
