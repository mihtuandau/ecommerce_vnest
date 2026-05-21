"use client";

import React from "react";
import { Filter } from "lucide-react";
import { RETURN_STATUS_CONFIG } from "../../constants";

interface ReturnsToolbarProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export function ReturnsToolbar({ filterStatus, onFilterChange }: ReturnsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Quản lý Đổi/Trả hàng</h1>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
          <span>Đơn hàng</span>
          <span className="text-[10px]">›</span>
          <span className="text-slate-600 font-medium">Yêu cầu Đổi/Trả</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100/50 transition-all appearance-none cursor-pointer hover:border-slate-400"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(RETURN_STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
