"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Download, RefreshCcw, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";

interface ReportHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isFetching?: boolean;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function ReportHeader({ onRefresh, onExport, isFetching, timeRange, setTimeRange }: ReportHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Báo cáo & Phân tích</h1>
          <p className="text-slate-500 text-sm">Theo dõi hiệu suất kinh doanh và xu hướng tăng trưởng của hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-10 rounded-xl border-slate-200 font-bold text-[11px] uppercase tracking-wider gap-2 bg-white shadow-none hover:bg-slate-50"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", isFetching && "animate-spin text-slate-400")} />
            Làm mới
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onExport}
            className="h-10 rounded-xl font-bold text-[11px] uppercase tracking-wider gap-2 bg-slate-900 hover:bg-slate-800 shadow-none transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {[
          { label: "30 ngày", value: "30_days" },
          { label: "3 tháng", value: "3_months" },
          { label: "1 năm", value: "1_year" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setTimeRange(btn.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
              timeRange === btn.value 
                ? "bg-white shadow-none border border-slate-200 text-slate-900" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
