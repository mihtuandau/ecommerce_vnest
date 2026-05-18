"use client";

import React from "react";
import { CheckCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

import { NotificationFilterType } from "../../constants";

interface NotificationsToolbarProps {
  filterType: NotificationFilterType;
  setFilterType: (type: NotificationFilterType) => void;
  unreadCount: number;
  isFetching: boolean;
  refetch: () => void;
  handleMarkAllRead: () => void;
  isMarkingAllRead: boolean;
}

export function NotificationsToolbar({
  filterType,
  setFilterType,
  unreadCount,
  isFetching,
  refetch,
  handleMarkAllRead,
  isMarkingAllRead,
}: NotificationsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 pb-5">
      {/* Filtering Tab buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-100 max-w-2xl">
        <button
          onClick={() => setFilterType("ALL")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            filterType === "ALL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilterType("UNREAD")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
            filterType === "UNREAD" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Chưa đọc
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setFilterType("ORDER")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            filterType === "ORDER" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => setFilterType("SECURITY")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            filterType === "SECURITY" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Bảo mật
        </button>
        <button
          onClick={() => setFilterType("SYSTEM")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            filterType === "SYSTEM" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Hệ thống
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 shadow-sm transition-all cursor-pointer"
            onClick={handleMarkAllRead}
            disabled={isMarkingAllRead}
          >
            <CheckCheck className="h-3.5 w-3.5 mr-2" />
            Đọc tất cả
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-slate-600 border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer"
          onClick={refetch}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-3.5 w-3.5 mr-2 text-slate-500", isFetching && "animate-spin")} />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
