"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/models";
import { Mail, Phone, Calendar, Shield, MapPin, ExternalLink, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { handleAvatarError } from "@/utils/avatar";

interface CustomerCardProps {
  user: User;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Đang hoạt động", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  SUSPENDED: { label: "Đã vô hiệu", color: "bg-rose-50 text-rose-600 border-rose-100" },
  PENDING: { label: "Chờ xác minh", color: "bg-amber-50 text-amber-600 border-amber-100" },
};

export function CustomerCard({ user }: CustomerCardProps) {
  const status = statusConfig[user.status] || statusConfig.ACTIVE;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 text-center border-b border-slate-100">
        <div className="relative inline-block">
          <div className="relative h-20 w-20 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 mx-auto text-3xl font-bold text-slate-300 overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              user.name?.charAt(0) || "U"
            )}
          </div>
          <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center", status.color.split(' ')[0])}>
            <div className={cn("h-2 w-2 rounded-full", status.color.split(' ')[1].replace('text-', 'bg-'))} />
          </div>
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">{user.name || "Chưa đặt tên"}</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liên hệ</p>
          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{user.phone || "Chưa cập nhật"}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Trạng thái</span>
            <Badge variant="outline" className={cn("rounded-md px-1.5 py-0 font-bold text-[10px]", status.color)}>
              {status.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500">Tham gia</span>
            <span className="text-slate-900">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
