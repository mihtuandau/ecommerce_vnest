import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { permissionsApi } from "@/features/permissions/api/index";
import type { UpdateRolePermissionsPayload } from "@/features/permissions/types";
import { permissionQueryKeys } from "@/features/permissions/hooks/queries";

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateRolePermissionsPayload) =>
      permissionsApi.updateRolePermissions(payload),
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.rolesPermissions,
      });
      success(`Đã cập nhật quyền cho vai trò ${role}`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật quyền");
    },
  });
}
