"use client";

import React from "react";
import { User } from "lucide-react";

interface ReturnCustomerCardProps {
  user: any;
}

export function ReturnCustomerCard({ user }: ReturnCustomerCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <User size={16} className="text-slate-700" />
        <h3 className="text-sm font-semibold text-slate-900">Khách hàng</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 font-medium truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="pt-1 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Số điện thoại:</span>
            <span className="text-slate-900 font-semibold">
              {user?.phone || "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
