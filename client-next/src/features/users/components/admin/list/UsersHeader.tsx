"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface UsersHeaderProps {
  totalUsers: number;
}

export function UsersHeader({ totalUsers }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className={adminUI.typography.heading}>Quản lý người dùng</h1>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
          <span>Người dùng</span>
          <span className="text-[10px]">/</span>
          <span className="text-slate-800">{totalUsers} tài khoản</span>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        className={cn(adminUI.button.base, adminUI.button.primary)}
      >
        <Link href={ROUTES.ADMIN_USERS_CREATE}>
          <UserPlus className={adminUI.icon.action} /> Thêm người dùng
        </Link>
      </Button>
    </div>
  );
}
