"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/models";
import { ChevronLeft, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { handleAvatarError } from "@/utils/avatar";
import { Role } from "@/types/enums";
import { ROLE_CONFIG } from "@/features/permissions/constants";
import { getImageUrl } from "@/utils/image";

interface CustomerHeaderProps {
  user: User;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: {
    label: "Đang hoạt động",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  SUSPENDED: { label: "Đã vô hiệu", color: "bg-rose-50 text-rose-600 border-rose-100" },
  PENDING: {
    label: "Chờ xác minh",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
};

export function CustomerHeader({ user }: CustomerHeaderProps) {
  const router = useRouter();
  const status = statusConfig[user.status] || statusConfig.ACTIVE;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

      <div className="relative p-6 md:p-8 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit pl-0 hover:bg-transparent text-slate-400 hover:text-primary gap-2 font-semibold text-xs uppercase tracking-[0.15em] transition-all hover:translate-x-[-4px]"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>

        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="relative shrink-0 group">
            <div className="relative h-28 w-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-white shadow-xl text-4xl font-bold text-slate-400 overflow-hidden transition-transform duration-500 group-hover:scale-105">
              {user.avatar ? (
                <Image
                  src={getImageUrl(user.avatar)}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                user.name?.charAt(0) || "U"
              )}
            </div>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg",
                status.color.split(" ")[0]
              )}
            >
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full animate-pulse",
                  status.color.split(" ")[1].replace("text-", "bg-")
                )}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight truncate">
                {user.name || "Chưa đặt tên"}
              </h1>
              <Badge
                variant="secondary"
                className="rounded-lg px-3 py-1 font-bold text-xs bg-slate-900 text-white border-none uppercase tracking-widest shadow-lg shadow-slate-200"
              >
                {ROLE_CONFIG[user.role as Role]?.label ?? user.role}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-bold">
              <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10">
                  <Mail className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                </div>
                {user.email}
              </div>
              <div className="flex items-center gap-2 group cursor-pointer hover:text-emerald-600 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50">
                  <Phone className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
                {user.phone || "Chưa cập nhật"}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <span>Thành viên từ {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2">
            <Button
              variant="outline"
              className="rounded-xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
            >
              Gửi Email
            </Button>
            <Button className="rounded-xl h-12 px-6 font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
              Hành động
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
