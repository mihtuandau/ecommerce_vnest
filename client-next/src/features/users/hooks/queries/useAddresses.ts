"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { usersApi } from "@/features/users/api";

export function useAddresses() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => usersApi.getAddresses(),
    enabled: !!user,
  });
}
