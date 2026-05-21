"use client";

import React from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useNotifications, useMarkNotificationRead } from "../../hooks";
import { NOTIFICATIONS_LIMITS } from "../../constants/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";

export function NotificationBell() {
  const { data: notificationsData } = useNotifications({
    limit: NOTIFICATIONS_LIMITS.BELL,
  });
  const markRead = useMarkNotificationRead();
  const notifications = (notificationsData as any)?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleNotificationClick = (id: number) => {
    markRead.mutate(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full text-brand-taupe relative"
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] rounded-[24px] p-2 bg-white shadow-2xl border border-brand-sand mt-2"
      >
        <div className="px-4 py-3 border-b border-brand-sand/50 flex justify-between items-center">
          <span className="text-[14px] font-bold text-brand-espresso">Thông báo</span>
          <Link
            href="/account?tab=notifications"
            className="text-[11px] font-bold text-brand-bronze hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center px-4">
              <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">
                <Bell size={24} className="text-brand-taupe" />
              </div>
              <p className="text-[12px] text-brand-taupe">
                Bạn không có thông báo mới nào
              </p>
            </div>
          ) : (
            notifications.map((n: any) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => handleNotificationClick(n.id)}
                className="p-3.5 rounded-xl focus:bg-brand-cream/50 cursor-pointer border-b border-brand-sand/30 last:border-0"
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      n.isRead ? "bg-transparent" : "bg-blue-500"
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-brand-espresso leading-snug">
                      {n.title}
                    </p>
                    <p className="text-[12px] text-brand-taupe mt-0.5 line-clamp-2 leading-relaxed">
                      {n.content}
                    </p>
                    <p
                      className="text-[10px] text-brand-taupe/60 mt-1.5"
                      suppressHydrationWarning
                    >
                      {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <div className="p-2 border-t border-brand-sand/50">
          <Button
            variant="ghost"
            className="w-full justify-center text-[11px] font-bold text-brand-taupe hover:text-brand-espresso"
            asChild
          >
            <Link href="/account?tab=notifications">Cài đặt thông báo</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
