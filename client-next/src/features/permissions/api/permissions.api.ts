import { api } from "@/lib/http";
import type {
  Permission,
  RoleWithPermissions,
  UpdateRolePermissionsPayload,
} from "@/features/permissions/types";

export const permissionsApi = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const { data } = await api.get("/auth/permissions");
    return data;
  },

  getRolesWithPermissions: async (): Promise<RoleWithPermissions[]> => {
    const { data } = await api.get("/auth/roles-permissions");
    return data;
  },

  updateRolePermissions: async ({
    role,
    permissionIds,
  }: UpdateRolePermissionsPayload) => {
    const { data } = await api.post("/auth/roles-permissions", {
      role,
      permissionIds,
    });
    return data;
  },
};
