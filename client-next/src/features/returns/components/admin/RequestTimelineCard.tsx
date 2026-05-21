"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface RequestTimelineCardProps {
  createdAt: string;
}

export function RequestTimelineCard({ createdAt }: RequestTimelineCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <Calendar size={16} className="text-slate-700" />
        <h3 className="text-sm font-semibold text-slate-900">
          Thời gian yêu cầu
        </h3>
      </div>
      <div className="text-center py-1">
        <p className="text-sm font-semibold text-slate-900">
          {new Date(createdAt).toLocaleString("vi-VN")}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Gửi yêu cầu đổi trả
        </p>
      </div>
    </div>
  );
}
