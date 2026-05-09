"use client";

import React from "react";
import { useUsers } from "@/features/users/hooks";
import { UserTable } from "@/features/users/components/admin/UserTable";
import { Header } from "@/features/users/components/admin/list/Header";
import { Stats } from "@/features/users/components/admin/list/Stats";
import { Toolbar } from "@/features/users/components/admin/list/Toolbar";
import { Role } from "@/types/enums";
import { User } from "@/types/models";

import { Spinner } from "@/components/ui/Spinner";

export default function AdminUsersPage() {
  const { data, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = React.useState("");

  const users: User[] = React.useMemo(() => (data as any)?.data || [], [data]);

  const stats = React.useMemo(() => ({
    total: users.length,
    admins: users.filter((u: any) => u.role === Role.ADMIN).length,
    active: users.length, // Could be more specific if active status exists
  }), [users]);

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter((u: any) => 
      u.name?.toLowerCase().includes(lower) || 
      u.email?.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  return (
    <div className="space-y-4 pb-10">
      <Header totalUsers={users.length} />

      <Stats 
        total={stats.total} 
        admins={stats.admins} 
        active={stats.active} 
      />

      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        <Toolbar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm font-bold text-slate-400">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <UserTable data={filteredUsers} />
          )}
        </div>
      </div>
    </div>
  );
}
