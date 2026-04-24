"use client";

import React from "react";
import { Save, Loader2, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface PermissionHeaderProps {
  isPending: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onRefresh: () => void;
}

export function PermissionHeader({ isPending, hasChanges, onSave, onRefresh }: PermissionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hệ thống</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Phân quyền người dùng</h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Quản lý các quyền truy cập cho từng nhóm vai trò trong hệ thống.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-lg gap-2 text-xs font-bold bg-white shadow-sm border-slate-200"
          onClick={onRefresh}
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
          Làm mới
        </Button>
        <Button
          className={cn(
            "h-9 px-6 rounded-lg gap-2 text-xs font-bold shadow-lg shadow-primary/20 transition-all duration-300",
            hasChanges
              ? "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5"
              : "bg-slate-100 text-slate-400 pointer-events-none"
          )}
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
