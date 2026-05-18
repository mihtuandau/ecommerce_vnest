"use client";

import React from "react";
import { History, Calendar, Terminal, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface LogsStatsProps {
  stats: {
    total: number;
    creates: number;
    updates: number;
    deletes: number;
  };
}

export function LogsStats({ stats }: LogsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <Card className="border-slate-100 rounded-2xl shadow-xs bg-white overflow-hidden hover:shadow-sm transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng lượt thao tác</p>
            <h3 className="text-2xl font-semibold text-slate-900">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-sm shrink-0">
            <History size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100 rounded-2xl shadow-xs bg-white overflow-hidden hover:shadow-sm transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo mới (POST)</p>
            <h3 className="text-2xl font-semibold text-emerald-600">{stats.creates}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-sm shrink-0">
            <Calendar size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100 rounded-2xl shadow-xs bg-white overflow-hidden hover:shadow-sm transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật (PATCH)</p>
            <h3 className="text-2xl font-semibold text-indigo-600">{stats.updates}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-sm shrink-0">
            <Terminal size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100 rounded-2xl shadow-xs bg-white overflow-hidden hover:shadow-sm transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xóa bỏ (DELETE)</p>
            <h3 className="text-2xl font-semibold text-rose-600">{stats.deletes}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-sm shrink-0">
            <ShieldAlert size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
