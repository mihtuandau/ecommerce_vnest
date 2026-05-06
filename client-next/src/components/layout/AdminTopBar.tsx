"use client";

import Link from "next/link";
import {
  Search,
  Bell,
  Settings,
  Command,
  User as UserIcon,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";

import { useState, useEffect } from "react";

export function AdminTopBar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header className="h-20 border-b bg-card px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm nhanh... (Ctrl + K)"
            className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-primary rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border bg-background text-xs font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-xl transition-colors">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>

        <div className="h-8 w-[1px] bg-muted mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1 pr-3 py-1 h-12 rounded-2xl gap-3 hover:bg-muted transition-all"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-primary font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold leading-none text-slate-800">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {(
                    {
                      ADMIN: "Quản trị viên",
                      KHO: "Quản lý kho",
                      BAN_HANG: "Bán hàng",
                      CUSTOMER: "Khách hàng",
                    } as Record<string, string>
                  )[(user as any)?.role] ??
                    (user as any)?.role ??
                    "Người dùng"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 mt-2 rounded-2xl p-2 shadow-2xl border-muted/50 animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuLabel className="font-semibold text-xs tracking-widest text-slate-500 px-3 py-3 uppercase">
              Tài khoản
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href="/admin/profile"
                className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 focus:bg-slate-100 transition-colors group"
              >
                <UserIcon className="h-4 w-4 text-slate-500 group-focus:text-slate-900" />
                <span className="font-medium text-sm text-slate-700 group-focus:text-slate-900">
                  Thông tin cá nhân
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/admin/settings"
                className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 focus:bg-slate-100 transition-colors group"
              >
                <Shield className="h-4 w-4 text-slate-500 group-focus:text-slate-900" />
                <span className="font-medium text-sm text-slate-700 group-focus:text-slate-900">
                  Cài đặt hệ thống
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5 px-3 text-rose-500 focus:bg-rose-50 focus:text-white font-semibold text-sm"
              onClick={logout}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
