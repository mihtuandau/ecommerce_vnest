"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Command,
  ExternalLink,
  Globe,
  Search,
  Settings,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
import { ROLE_CONFIG } from "@/features/permissions/constants/index";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks";
import { ROUTES } from "@/constants/routes";
import { Role } from "@/types/enums";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/image";

export function AdminTopBar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  const { data: notificationsData } = useNotifications({ limit: 5 });
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleNotifClick = (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/70 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-all font-sans select-none shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="flex items-center gap-3.5 w-1/3">
        <div className="relative w-full max-w-[280px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-teal-700 transition-colors" />
          <Input
            placeholder="Tìm kiếm nhanh... (Ctrl + K)"
            className="pl-9 pr-10 h-9 bg-slate-50/80 border border-slate-200 hover:bg-slate-50 focus:bg-white focus:border-teal-200 transition-all rounded-xl text-sm focus:ring-0 focus-visible:ring-0 focus-visible:outline-none placeholder-slate-400 text-slate-700"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-400 shadow-3xs">
            <Command className="h-2.5 w-2.5 opacity-80" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-1.5 rounded-xl h-9 px-3 border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-all shadow-3xs"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            Xem cửa hàng
            <ExternalLink className="h-3 w-3 ml-0.5 text-slate-400 opacity-40 shrink-0" />
          </Link>
        </Button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1.5 hidden md:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-teal-50 size-9 flex items-center justify-center text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-teal-700 border-2 border-white text-[9px] font-semibold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 mt-2.5 rounded-2xl p-2 shadow-2xl border border-slate-100 bg-white animate-in fade-in zoom-in-95 duration-200 space-y-1"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50">
              <span className="font-medium text-xs tracking-wide text-slate-400 uppercase">
                Thông báo mới
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium italic">
                  Không có thông báo mới nào
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className={cn(
                      "p-2.5 cursor-pointer hover:bg-teal-50 transition-all rounded-xl flex gap-2.5 items-start",
                      !n.isRead && "bg-teal-50/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                        !n.isRead ? "bg-teal-600 animate-pulse" : "bg-transparent"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm truncate",
                          !n.isRead
                            ? "text-slate-800 font-semibold"
                            : "text-slate-500 font-medium"
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                        {n.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DropdownMenuSeparator className="bg-slate-50" />

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_NOTIFICATIONS}
                className="rounded-xl cursor-pointer py-2 px-3 text-center text-sm font-medium text-teal-700 justify-center hover:bg-teal-50 transition-colors w-full block"
              >
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-teal-50 size-9 flex items-center justify-center text-slate-500 hover:text-teal-700 transition-colors"
          asChild
        >
          <Link href={ROUTES.ADMIN_SETTINGS}>
            <Settings className="h-4.5 w-4.5" />
          </Link>
        </Button>

        <div className="h-6 w-[1px] bg-slate-100 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1.5 pr-2.5 py-1 h-10 rounded-xl gap-2 hover:bg-teal-50 active:scale-98 transition-all border border-transparent hover:border-teal-100 group"
            >
              <div className="h-7 w-7 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100 shadow-3xs overflow-hidden relative shrink-0 group-hover:ring-2 group-hover:ring-teal-600/10 transition-all duration-300">
                {user?.avatar ? (
                  <Image
                    src={getImageUrl(user.avatar)}
                    alt={user.name || "User"}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-teal-700 font-semibold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block space-y-0.5">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1 leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase">
                  {ROLE_CONFIG[user?.role as Role]?.label ?? user?.role}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2.5 rounded-2xl p-2 shadow-2xl border border-slate-100 bg-white animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuLabel className="font-semibold text-sm text-slate-700 px-3 py-2">
              Tài khoản
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_PROFILE}
                className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 focus:bg-teal-50 transition-colors group"
              >
                <UserIcon className="h-4 w-4 text-slate-400 group-focus:text-teal-700" />
                <span className="font-semibold text-sm text-slate-600 group-focus:text-teal-800">
                  Thông tin cá nhân
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_SETTINGS}
                className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 focus:bg-teal-50 transition-colors group"
              >
                <Shield className="h-4 w-4 text-slate-400 group-focus:text-teal-700" />
                <span className="font-semibold text-sm text-slate-600 group-focus:text-teal-800">
                  Cài đặt hệ thống
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-slate-50" />

            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2 px-3 text-rose-500 hover:bg-rose-50/50 focus:bg-rose-50/50 font-semibold text-sm"
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
