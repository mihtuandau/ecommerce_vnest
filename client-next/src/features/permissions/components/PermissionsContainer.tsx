"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Shield } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { useAllPermissions, useRolesWithPermissions, useUpdateRolePermissions } from "../hooks";
import { PermissionHeader } from "./PermissionHeader";
import { RoleTabsList } from "./RoleTabsList";
import { RoleInfoCard } from "./RoleInfoCard";
import { PermissionMatrix } from "./PermissionMatrix";
import { MANAGED_ROLES } from "../constants";
import { Permission } from "../api";
import { Role } from "@/types/enums";

export function PermissionsContainer() {
  const { data: allPermissions = [], isLoading: loadingPerms, refetch: refetchPerms } = useAllPermissions();
  const { data: rolesData = [], isLoading: loadingRoles, refetch: refetchRoles } = useRolesWithPermissions();
  const { mutate: updateRole, isPending } = useUpdateRolePermissions();

  const [localPerms, setLocalPerms] = useState<Record<string, Set<number>>>({});
  const [activeRole, setActiveRole] = useState<Role>(Role.ADMIN);
  const [dirtyRoles, setDirtyRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const map: Record<string, Set<number>> = {};
    MANAGED_ROLES.forEach((r) => { map[r] = new Set<number>(); });
    rolesData.forEach((r: { role: string; permissions: { id: number }[] }) => {
      map[r.role] = new Set<number>((r.permissions ?? []).map((p: { id: number }) => Number(p.id)));
    });
    setLocalPerms(map);
    setDirtyRoles(new Set());
  }, [rolesData]);

  const grouped = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((p) => {
      const prefix = p.name.split(".")[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(p);
    });
    return groups;
  }, [allPermissions]);

  function toggle(permId: number) {
    const id = Number(permId);
    setLocalPerms((prev) => {
      const cur = new Set<number>(prev[activeRole] ?? []);
      cur.has(id) ? cur.delete(id) : cur.add(id);
      return { ...prev, [activeRole]: cur };
    });
    setDirtyRoles((prev) => new Set(prev).add(activeRole));
  }

  function handleSave() {
    const ids = Array.from(localPerms[activeRole] ?? []).map(Number);
    updateRole({ role: activeRole, permissionIds: ids }, {
      onSuccess: () => {
        setDirtyRoles((prev) => { const n = new Set(prev); n.delete(activeRole); return n; });
        refetchRoles();
      },
    });
  }

  const isLoading = loadingPerms || loadingRoles;
  const activePerms = localPerms[activeRole] ?? new Set<number>();

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PermissionHeader
        isPending={isPending}
        hasChanges={dirtyRoles.has(activeRole)}
        onSave={handleSave}
        onRefresh={() => { refetchPerms(); refetchRoles(); }}
      />

      <Tabs value={activeRole} onValueChange={(val) => setActiveRole(val as Role)} className="w-full">
        <RoleTabsList dirtyRoles={dirtyRoles} />

        <TabsContent value={activeRole} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <RoleInfoCard
                activeRole={activeRole}
                activePermsCount={activePerms.size}
                totalPermsCount={allPermissions.length}
              />
            </div>

            <div className="lg:col-span-8">
              <PermissionMatrix
                groupedPermissions={grouped}
                activePerms={activePerms}
                onToggle={toggle}
                onSelectAll={() => {
                  setLocalPerms(prev => ({ ...prev, [activeRole]: new Set(allPermissions.map(p => p.id)) }));
                  setDirtyRoles(prev => new Set(prev).add(activeRole));
                }}
                onClearAll={() => {
                  setLocalPerms(prev => ({ ...prev, [activeRole]: new Set() }));
                  setDirtyRoles(prev => new Set(prev).add(activeRole));
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {allPermissions.length === 0 && (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
          <Shield className="h-10 w-10 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Hệ thống chưa có quyền nào</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            Vui lòng kiểm tra lại quá trình khởi tạo dữ liệu mẫu (seed) trên backend.
          </p>
        </div>
      )}
    </div>
  );
}
