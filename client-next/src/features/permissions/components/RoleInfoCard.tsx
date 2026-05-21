"use client";

import React from "react";
import { Info, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Role } from "@/types/enums";
import { ROLE_CONFIG } from "../constants";

interface RoleInfoCardProps {
  activeRole: string;
  activePermsCount: number;
  totalPermsCount: number;
}

export function RoleInfoCard({
  activeRole,
  activePermsCount,
  totalPermsCount,
}: RoleInfoCardProps) {
  const roleConf = ROLE_CONFIG[activeRole as Role] || ROLE_CONFIG[Role.CUSTOMER];

  return (
    <Card className="border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] rounded-2xl bg-slate-50/50 font-sans">
      <CardHeader className="pb-2">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <Shield className="h-5 w-5 text-slate-500" />
        </div>
        <CardTitle className="text-lg  font-semibold text-slate-900">
          Thông tin vai trò
        </CardTitle>
        <CardDescription className="text-xs font-medium">
          {roleConf.desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Trạng thái</span>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px]"
            >
              Hoạt động
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Quyền hạn cấp</span>
            <span className="text-sm font-semibold text-slate-900">
              {activePermsCount} / {totalPermsCount}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-medium">
            Bất kỳ thay đổi nào đối với vai trò này sẽ yêu cầu người dùng thuộc nhóm này
            tải lại trang để cập nhật quyền mới.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
