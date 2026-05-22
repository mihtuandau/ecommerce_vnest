"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { usersApi } from "@/features/users/api";

export function useResetPassword() {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.resetPassword(id),
    onSuccess: () => {
      success("Đã reset mật khẩu về mặc định (123456)");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi reset mật khẩu");
    },
  });
}
