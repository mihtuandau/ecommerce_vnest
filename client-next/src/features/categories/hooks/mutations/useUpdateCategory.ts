"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { categoriesApi } from "@/features/categories/api";
import { useToast } from "@/hooks/useToast";

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: FormData }) =>
      categoriesApi.updateCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      success("Cập nhật danh mục thành công");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });
}
