"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useToast } from "@/hooks/useToast";
import { usersApi } from "@/features/users/api";
import type { User } from "@/types/models";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { setUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      setUser(updatedUser);
      success("Cập nhật hồ sơ thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    },
  });
}
