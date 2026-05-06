import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsApi } from "../api";
import { useToast } from "@/hooks/useToast";

const KEYS = {
  permissions: ["permissions"],
  rolesPermissions: ["roles-permissions"],
};

export function useAllPermissions() {
  return useQuery({
    queryKey: KEYS.permissions,
    queryFn: permissionsApi.getAllPermissions,
  });
}

export function useRolesWithPermissions() {
  return useQuery({
    queryKey: KEYS.rolesPermissions,
    queryFn: permissionsApi.getRolesWithPermissions,
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ role, permissionIds }: { role: string; permissionIds: number[] }) =>
      permissionsApi.updateRolePermissions(role, permissionIds),
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.rolesPermissions });
      success(`Đã cập nhật quyền cho vai trò ${role}`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      error(err?.response?.data?.message || "Lỗi khi cập nhật quyền");
    },
  });
}
