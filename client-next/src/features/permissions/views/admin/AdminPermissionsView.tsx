"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Spinner } from "@/components/ui/Spinner";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { MANAGED_ROLES } from "@/features/permissions/constants/index";
import { PermissionHeader } from "@/features/permissions/components/PermissionHeader";
import { PermissionMatrix } from "@/features/permissions/components/PermissionMatrix";
import { RoleInfoCard } from "@/features/permissions/components/RoleInfoCard";
import { RoleTabsList } from "@/features/permissions/components/RoleTabsList";
import {
  useAllPermissions,
  useRolesWithPermissions,
  useUpdateRolePermissions,
} from "@/features/permissions/hooks";
import type { Permission } from "@/features/permissions/types";
import { usePermission } from "@/hooks/usePermission";
import { Role } from "@/types/enums";

export function AdminPermissionsView() {
  const { can } = usePermission();
  const {
    data: allPermissions = [],
    isLoading: loadingPerms,
    refetch: refetchPerms,
  } = useAllPermissions();
  const {
    data: rolesData = [],
    isLoading: loadingRoles,
    refetch: refetchRoles,
  } = useRolesWithPermissions();
  const { mutate: updateRole, isPending } = useUpdateRolePermissions();

  const [localPerms, setLocalPerms] = useState<Record<string, Set<number>>>({});
  const [activeRole, setActiveRole] = useState<Role>(Role.ADMIN);
  const [dirtyRoles, setDirtyRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const map: Record<string, Set<number>> = {};
    MANAGED_ROLES.forEach((role) => {
      map[role] = new Set<number>();
    });
    rolesData.forEach((roleData) => {
      map[roleData.role] = new Set<number>(
        (roleData.permissions ?? []).map((permission) => Number(permission.id))
      );
    });
    setLocalPerms(map);
    setDirtyRoles(new Set());
  }, [rolesData]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((permission) => {
      const prefix = permission.name.split(".")[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(permission);
    });
    return groups;
  }, [allPermissions]);

  const isLoading = loadingPerms || loadingRoles;
  const activePerms = localPerms[activeRole] ?? new Set<number>();

  const markRoleDirty = () => {
    setDirtyRoles((prev) => new Set(prev).add(activeRole));
  };

  const togglePermission = (permissionId: number) => {
    const id = Number(permissionId);
    setLocalPerms((prev) => {
      const current = new Set<number>(prev[activeRole] ?? []);
      current.has(id) ? current.delete(id) : current.add(id);
      return { ...prev, [activeRole]: current };
    });
    markRoleDirty();
  };

  const handleSave = () => {
    updateRole(
      {
        role: activeRole,
        permissionIds: Array.from(activePerms).map(Number),
      },
      {
        onSuccess: () => {
          setDirtyRoles((prev) => {
            const next = new Set(prev);
            next.delete(activeRole);
            return next;
          });
          refetchRoles();
        },
      }
    );
  };

  if (!can("user.manage") && !can("settings.manage")) {
    return <AccessDenied permission="user.manage" />;
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <p className="text-xs font-semibold text-slate-400">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PermissionHeader
        isPending={isPending}
        hasChanges={dirtyRoles.has(activeRole)}
        onSave={handleSave}
        onRefresh={() => {
          refetchPerms();
          refetchRoles();
        }}
      />

      <Tabs
        value={activeRole}
        onValueChange={(value) => setActiveRole(value as Role)}
        className="w-full"
      >
        <RoleTabsList dirtyRoles={dirtyRoles} />

        <TabsContent value={activeRole} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <RoleInfoCard
                activeRole={activeRole}
                activePermsCount={activePerms.size}
                totalPermsCount={allPermissions.length}
              />
            </div>

            <div className="lg:col-span-8">
              <PermissionMatrix
                groupedPermissions={groupedPermissions}
                activePerms={activePerms}
                onToggle={togglePermission}
                onSelectAll={() => {
                  setLocalPerms((prev) => ({
                    ...prev,
                    [activeRole]: new Set(
                      allPermissions.map((permission) => permission.id)
                    ),
                  }));
                  markRoleDirty();
                }}
                onClearAll={() => {
                  setLocalPerms((prev) => ({
                    ...prev,
                    [activeRole]: new Set(),
                  }));
                  markRoleDirty();
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {allPermissions.length === 0 && (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
          <Shield className="h-10 w-10 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">
            Hệ thống chưa có quyền nào
          </h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            Vui lòng kiểm tra lại quá trình khởi tạo dữ liệu mẫu trên backend.
          </p>
        </div>
      )}
    </div>
  );
}
