"use client";

import React from "react";
import {
  Bell,
  BellOff,
  ShoppingCart,
  ShieldAlert,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface NotificationsListProps {
  filteredNotifications: any[];
  isLoading: boolean;
  handleNotificationClick: (notif: any) => void;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}

export function NotificationsList({
  filteredNotifications,
  isLoading,
  handleNotificationClick,
  meta,
  page,
  setPage,
}: NotificationsListProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-xs shrink-0">
            <ShoppingCart size={18} />
          </div>
        );
      case "SECURITY":
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-xs shrink-0">
            <ShieldAlert size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-xs shrink-0">
            <Bell size={18} />
          </div>
        );
    }
  };

  return (
    <div className="lg:col-span-8 space-y-5">
      {/* List display */}
      <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Đang tải thông báo...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <BellOff className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-base font-bold text-slate-800">
                Hộp thư thông báo trống
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Hiện tại không có thông báo nào mới thuộc danh mục đã chọn.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notif: any) => {
                const relative = dayjs(notif.createdAt).fromNow();
                const formattedTime = dayjs(notif.createdAt).format(
                  "HH:mm - DD/MM/YYYY"
                );

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "p-5 flex gap-4 items-start cursor-pointer hover:bg-slate-50 transition-all duration-200 border-l-[3px]",
                      notif.isRead
                        ? "border-l-transparent bg-white"
                        : "border-l-indigo-600 bg-indigo-50/10"
                    )}
                  >
                    {getNotificationIcon(notif.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h4
                          className={cn(
                            "text-xs truncate",
                            notif.isRead
                              ? "text-slate-700 font-semibold"
                              : "text-slate-900 font-bold"
                          )}
                        >
                          {notif.title}
                        </h4>
                        <span className="text-[9px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                          {relative}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                        {notif.content}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-450 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {formattedTime}
                        </span>
                        {notif.link && (
                          <span className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold uppercase text-[9px] tracking-wider">
                            Xem chi tiết <ArrowRight size={10} />
                          </span>
                        )}
                      </div>
                    </div>

                    {!notif.isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 self-center shrink-0 shadow-sm" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination footer */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Trang trước
            </Button>
            <span className="text-xs font-bold text-slate-500">
              Trang {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={page === meta.totalPages}
            >
              Trang sau
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
