import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "@/features/permissions/api/index";
import { permissionQueryKeys } from "./useAllPermissions";

export function useRolesWithPermissions() {
  return useQuery({
    queryKey: permissionQueryKeys.rolesPermissions,
    queryFn: permissionsApi.getRolesWithPermissions,
  });
}
