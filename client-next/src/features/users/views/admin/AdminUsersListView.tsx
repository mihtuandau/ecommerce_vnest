"use client";

import { useMemo, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { UsersHeader } from "@/features/users/components/admin/list/UsersHeader";
import { UsersStats } from "@/features/users/components/admin/list/UsersStats";
import { UsersTable } from "@/features/users/components/admin/list/UsersTable";
import { UsersToolbar } from "@/features/users/components/admin/list/UsersToolbar";
import { useUsers } from "@/features/users/hooks";
import { Role } from "@/types/enums";
import type { User } from "@/types/models";

export function AdminUsersListView() {
  const { data, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const users: User[] = useMemo(() => (data as any)?.data || [], [data]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === Role.ADMIN).length,
      active: users.length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lower = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  return (
    <div className="space-y-4 pb-10">
      <UsersHeader totalUsers={users.length} />
      <UsersStats total={stats.total} admins={stats.admins} active={stats.active} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        <UsersToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm font-bold text-slate-400">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <UsersTable data={filteredUsers} />
          )}
        </div>
      </div>
    </div>
  );
}
