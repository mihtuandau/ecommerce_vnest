"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      success("Tạo người dùng thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi tạo người dùng");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      success("Cập nhật thông tin thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      success("Đã xóa người dùng");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa người dùng");
    },
  });
}
