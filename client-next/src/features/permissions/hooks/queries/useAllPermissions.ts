import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "@/features/permissions/api/index";

export const permissionQueryKeys = {
  permissions: ["permissions"] as const,
  rolesPermissions: ["roles-permissions"] as const,
};

export function useAllPermissions() {
  return useQuery({
    queryKey: permissionQueryKeys.permissions,
    queryFn: permissionsApi.getAllPermissions,
  });
}
