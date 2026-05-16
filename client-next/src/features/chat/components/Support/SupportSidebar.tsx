"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface SupportSidebarProps {
  rooms: any[];
  roomsLoading: boolean;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SupportSidebar({
  rooms,
  roomsLoading,
  selectedRoomId,
  onSelectRoom,
  searchQuery,
  setSearchQuery,
}: SupportSidebarProps) {
  return (
    <div className="w-[320px] border-r border-[#E2E8F0] bg-white flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-bold text-[#0F172A]">Hội thoại hỗ trợ</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-[12px] font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm">
            <Plus size={14} /> Mới
          </button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng..." 
            className="w-full pl-3 pr-10 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[13px] outline-none focus:border-[#3B82F6] focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={15} />
        </div>
      </div>
      
      <div className="flex border-b border-[#E2E8F0] shrink-0 px-2 bg-[#F8FAFC]">
        <button className="flex-1 py-3 text-[12px] font-bold text-[#2563EB] border-b-2 border-[#2563EB]">Tất cả ({rooms?.length || 0})</button>
        <button className="flex-1 py-3 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-colors">Của tôi</button>
        <button className="flex-1 py-3 text-[12px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-colors">Chờ xử lý</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {roomsLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-[#F1F5F9] rounded-xl animate-pulse" />)}
          </div>
        ) : rooms.map((room) => {
          const isActive = selectedRoomId === room.roomId;
          const lastMsg = room.lastMessage;
          const customer = room.customer;
          
          return (
            <div 
              key={room.roomId}
              onClick={() => onSelectRoom(room.roomId)}
              className={cn(
                "p-4 cursor-pointer border-b border-[#F1F5F9] flex gap-3 items-start transition-all duration-200 relative",
                isActive ? "bg-[#EFF6FF] border-l-[4px] border-l-[#2563EB]" : "hover:bg-[#F8FAFC]"
              )}
            >
              <div className="w-11 h-11 rounded-full bg-[#E2E8F0] flex items-center justify-center font-bold text-[#475569] text-[15px] shrink-0 border border-white shadow-sm">
                {customer?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn("text-[13.5px] font-bold truncate", isActive ? "text-[#1E40AF]" : "text-[#1E293B]")}>
                    {customer?.name || "Khách hàng"}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-medium whitespace-nowrap">{dayjs(lastMsg?.createdAt).fromNow(true)}</span>
                </div>
                <div className="text-[12px] text-[#64748B] truncate mb-1 leading-relaxed">{lastMsg?.message}</div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                    room.unreadCount > 0 ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F1F5F9] text-[#64748B]"
                  )}>
                    {room.unreadCount > 0 ? "Mới" : "Đã phản hồi"}
                  </span>
                </div>
              </div>
              {room.unreadCount > 0 && (
                <div className="w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                  {room.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
