"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";
import { usersApi } from "@/features/users/api";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      success("Đã xóa người dùng");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err.response?.data?.message || "Xóa người dùng thất bại");
    },
  });
}
