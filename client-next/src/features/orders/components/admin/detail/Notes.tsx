"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

export function Notes({ order }: { order: any }) {
  const [noteText, setNoteText] = useState("");

  return (
    <div className={cn(adminUI.card.base, adminUI.card.padding)}>
      <div className="flex items-center gap-2 mb-6">
         <MessageSquare className="h-5 w-5 text-slate-500" />
         <h3 className={adminUI.typography.sectionTitle}>Ghi chú nội bộ</h3>
      </div>
      
      {order.note && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-[12px] mb-4 flex gap-2 items-start">
          <span className="font-bold shrink-0">💬 Khách ghi chú:</span>
          <span>"{order.note}"</span>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {/* Placeholder for future backend integration of Admin Notes */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold text-slate-600">Admin</span>
            <span className="text-[10px] text-slate-400">Chưa có ghi chú nội bộ nào</span>
          </div>
        </div>
      </div>

      <textarea 
        className="w-full border border-slate-200 rounded-xl p-3 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px] resize-none"
        placeholder="Thêm ghi chú nội bộ (chỉ quản trị viên mới thấy)..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      
      <Button 
        className={cn(adminUI.button.base, adminUI.button.primary, "w-full mt-3")}
        onClick={() => {
          if(!noteText) return;
          // TODO: Implement update admin note API
          alert("Chức năng đang phát triển!");
          setNoteText("");
        }}
      >
        Lưu ghi chú
      </Button>
    </div>
  );
}
