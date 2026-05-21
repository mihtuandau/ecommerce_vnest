export interface Permission {
  id: number;
  name: string;
  description: string | null;
}

export interface RoleWithPermissions {
  role: string;
  permissions: Permission[];
}

export interface UpdateRolePermissionsPayload {
  role: string;
  permissionIds: number[];
}
