"use client";

import { ShieldCheck, UserCheck, Users } from "lucide-react";

interface UsersStatsProps {
  total: number;
  admins: number;
  active: number;
}

export function UsersStats({ total, admins, active }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <Users className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-600 tracking-wide">
            Tổng người dùng
          </p>
          <p className="text-xl font-semibold text-slate-800">{total}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-600 tracking-wide">
            Quản trị viên
          </p>
          <p className="text-xl font-semibold text-slate-800">{admins}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <UserCheck className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-600 tracking-wide">
            Đang hoạt động
          </p>
          <p className="text-xl font-semibold text-slate-800">{active}</p>
        </div>
      </div>
    </div>
  );
}
