import { api } from "@/lib/axios";

export const permissionsApi = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const { data } = await api.get("/auth/permissions");
    return data;
  },

  getRolesWithPermissions: async (): Promise<RoleWithPermissions[]> => {
    const { data } = await api.get("/auth/roles-permissions");
    return data;
  },

  updateRolePermissions: async (role: string, permissionIds: number[]) => {
    const { data } = await api.post("/auth/roles-permissions", { role, permissionIds });
    return data;
  },
};

export interface Permission {
  id: number;
  name: string;
  description: string | null;
}

export interface RoleWithPermissions {
  role: string;
  permissions: Permission[];
}
