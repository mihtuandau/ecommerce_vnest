"use client";

import React from "react";
import { Phone, Check, MoreVertical, Users } from "lucide-react";      

interface ChatHeaderProps {
  selectedRoomId: string | null;
  selectedRoom: any;
}

export function ChatHeader({ selectedRoomId, selectedRoom }: ChatHeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      {selectedRoomId?.startsWith("room_staff_") ? (
        (() => {
          const isInternalGroup = selectedRoomId === "room_staff_internal";
          const initials = selectedRoom?.customer?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "NV";
          return (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-sm border border-amber-200 shadow-xs">
                  {isInternalGroup ? <Users className="h-5 w-5 text-amber-700" /> : initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  {isInternalGroup ? "Kênh Nội Bộ Cửa Hàng" : selectedRoom?.customer?.name}
                  <span className="text-[9px] bg-amber-100 border border-amber-200/50 text-amber-800 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    {isInternalGroup ? "Nhân viên" : selectedRoom?.customer?.role}
                  </span>
                </h3>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {isInternalGroup 
                    ? "Kênh trao đổi & thông báo nội bộ giữa các bộ phận" 
                    : "Trò chuyện trực tiếp & bảo mật nội bộ"
                  }
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-550/10 flex items-center justify-center font-semibold text-slate-500 text-sm shadow-xs border border-slate-100">
              {selectedRoom?.customer?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{selectedRoom?.customer?.name || "Khách hàng"}</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
              {selectedRoom?.customer?.email || selectedRoom?.customer?.phone || "Khách hàng trực tuyến 🟢"}
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {!selectedRoomId?.startsWith("room_staff_") && (
          <>
            <button title="Gọi điện" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-550/10 hover:text-indigo-600 transition-all cursor-pointer"><Phone size={15} /></button>
            <button title="Đánh dấu hoàn thành" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-555/10 hover:text-emerald-600 transition-all cursor-pointer"><Check size={15} /></button>
          </>
        )}
        <button title="Thêm hành động" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-550/10 hover:text-indigo-600 transition-all cursor-pointer"><MoreVertical size={15} /></button>
      </div>
    </div>
  );
}
