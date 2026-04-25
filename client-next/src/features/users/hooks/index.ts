"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { useAuthStore } from "@/store/useAuthStore";
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { setUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      setUser(updatedUser);
      success("Cập nhật hồ sơ thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    },
  });
}

// ── Address Hooks ──

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => usersApi.getAddresses(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => usersApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Thêm địa chỉ thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi thêm địa chỉ");
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Cập nhật địa chỉ thành công");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật địa chỉ");
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Đã xóa địa chỉ");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi xóa địa chỉ");
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Đã đặt làm mặc định");
    },
    onError: (err: any) => {
      error(err?.response?.data?.message || "Lỗi khi thiết lập mặc định");
    },
  });
}
