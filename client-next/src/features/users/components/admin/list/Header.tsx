"use client";

import React from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface HeaderProps {
  totalUsers: number;
}

export function Header({ totalUsers }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Người dùng</h1>
        <p className="text-slate-500 text-sm">
          Quản lý {totalUsers} tài khoản trong hệ thống LUXE.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          size="sm"
          className="font-bold gap-2 bg-primary text-white hover:bg-slate-800 shadow-sm"
        >
          <Link href={ROUTES.ADMIN_USERS_CREATE}>
            <UserPlus className="h-4 w-4" /> Thêm người dùng
          </Link>
        </Button>
      </div>
    </div>
  );
}
