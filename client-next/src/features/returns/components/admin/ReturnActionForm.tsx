"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

interface ReturnActionFormProps {
  adminNote: string;
  onNoteChange: (note: string) => void;
}

export function ReturnActionForm({ adminNote, onNoteChange }: ReturnActionFormProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
      <div className="flex items-center gap-2.5 text-slate-900">
        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
          <RotateCcw size={14} />
        </div>
        <h3 className="text-base font-semibold tracking-tight">Xử lý yêu cầu</h3>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Ghi chú của quản trị viên
        </Label>
        <Textarea
          value={adminNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Nhập lý do phê duyệt hoặc từ chối..."
          className="min-h-[100px] bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200 outline-none text-sm p-4"
        />
        <p className="text-xs text-slate-400 font-medium italic">
          Ghi chú này sẽ được hiển thị cho khách hàng xem.
        </p>
      </div>
    </div>
  );
}
