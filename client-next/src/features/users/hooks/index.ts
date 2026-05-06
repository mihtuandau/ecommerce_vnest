"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { useAuthStore } from "@/store/useAuthStore";
import { queryKeys } from "@/constants/queryKeys";
import { useToast } from "@/hooks/useToast";

export function useUsers(params?: Record<string, string | number>) {
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
    mutationFn: (data: Partial<User>) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      success("Tạo người dùng thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi tạo người dùng");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      success("Cập nhật thông tin thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
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
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err.response?.data?.message || "Xóa người dùng thất bại");
    },
  });
}

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

// ── Address Hooks ──

export function useAddresses() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => usersApi.getAddresses(),
    enabled: !!user,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Address>) => usersApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Thêm địa chỉ thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi thêm địa chỉ");
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      usersApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      success("Cập nhật địa chỉ thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
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
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err.response?.data?.message || "Cập nhật mật khẩu thất bại");
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
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi thiết lập mặc định");
    },
  });
}
