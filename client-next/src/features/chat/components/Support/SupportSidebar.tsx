"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input, Button } from "@/components/ui";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface SupportSidebarProps {
  rooms: any[];
  roomsLoading: boolean;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab?: "customers" | "staff";
  setActiveTab?: (tab: "customers" | "staff") => void;
  staffMembers?: any[];
}

export function SupportSidebar({
  rooms,
  roomsLoading,
  selectedRoomId,
  onSelectRoom,
  searchQuery,
  setSearchQuery,
  activeTab = "customers",
  setActiveTab,
  staffMembers = [],
}: SupportSidebarProps) {
  const { user } = useAuthStore();

  const getStaffRoomId = (staffId: number) => {
    if (!user) return "";
    const ids = [Number(user.id), staffId].sort((a, b) => a - b);
    return `room_staff_${ids[0]}_${ids[1]}`;
  };

  return (
    <div className="w-[320px] border-r border-slate-100 bg-white flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-800">Hội thoại hỗ trợ</span>
          <Button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm cursor-pointer h-auto">
            <Plus size={14} /> Mới
          </Button>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder={
              activeTab === "staff" ? "Tìm kiếm nhân viên..." : "Tìm kiếm khách hàng..."
            }
            className="w-full pl-3 pr-10 py-2.5 bg-slate-550/10 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
            size={14}
          />
        </div>
      </div>

      <div className="flex border-b border-slate-100 shrink-0 px-2 bg-slate-50/50">
        <button
          onClick={() => setActiveTab?.("customers")}
          className={cn(
            "flex-1 py-3 text-xs font-bold transition-all cursor-pointer border-b-2 text-center",
            activeTab === "customers"
              ? "text-indigo-650 border-indigo-650"
              : "text-slate-400 border-transparent hover:text-slate-700"
          )}
        >
          Khách hàng
        </button>
        <button
          onClick={() => setActiveTab?.("staff")}
          className={cn(
            "flex-1 py-3 text-xs font-bold transition-all cursor-pointer border-b-2 text-center",
            activeTab === "staff"
              ? "text-amber-600 border-amber-500"
              : "text-slate-400 border-transparent hover:text-slate-700"
          )}
        >
          Nhân viên ({staffMembers.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {activeTab === "staff" ? (
          staffMembers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Không tìm thấy nhân viên nào khác
            </div>
          ) : (
            staffMembers
              .filter((s: any) =>
                s.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((s: any) => {
                const isSelected = selectedRoomId === getStaffRoomId(s.id);
                const initials =
                  s.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "NV";
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectRoom(getStaffRoomId(s.id))}
                    className={cn(
                      "p-4 cursor-pointer border-b border-slate-100 flex gap-3 items-center transition-all duration-200 relative",
                      isSelected
                        ? "bg-amber-50/40 border-l-[3px] border-l-amber-500"
                        : "hover:bg-slate-50/55"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border shadow-xs",
                        isSelected
                          ? "bg-amber-100 text-amber-750 border-amber-200"
                          : "bg-slate-100 text-slate-550 border-slate-200"
                      )}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={cn(
                            "text-[13px] font-semibold truncate",
                            isSelected ? "text-amber-800" : "text-slate-800"
                          )}
                        >
                          {s.name}
                        </span>
                        <span className="text-[8px] bg-slate-100 border border-slate-200/60 text-slate-500 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                          {s.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {s.email}
                      </div>
                    </div>
                  </div>
                );
              })
          )
        ) : roomsLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 bg-slate-50 rounded-xl" />
            ))}
          </div>
        ) : (
          rooms.map((room) => {
            const isActive = selectedRoomId === room.roomId;
            const lastMsg = room.lastMessage;
            const customer = room.customer;

            return (
              <div
                key={room.roomId}
                onClick={() => onSelectRoom(room.roomId)}
                className={cn(
                  "p-4 cursor-pointer border-b border-slate-100 flex gap-3 items-start transition-all duration-200 relative",
                  isActive
                    ? "bg-slate-50/70 border-l-[3px] border-l-indigo-600"
                    : "hover:bg-slate-50/50"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-550/10 flex items-center justify-center font-semibold text-slate-500 text-sm shrink-0 border border-slate-100 shadow-xs">
                  {customer?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={cn(
                        "text-[13px] font-semibold truncate",
                        isActive ? "text-indigo-650" : "text-slate-800"
                      )}
                    >
                      {customer?.name || "Khách hàng"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {dayjs(lastMsg?.createdAt).fromNow(true)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate mb-1 leading-relaxed">
                    {lastMsg?.message}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider",
                        room.unreadCount > 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200/50"
                      )}
                    >
                      {room.unreadCount > 0 ? "Mới" : "Đã phản hồi"}
                    </span>
                  </div>
                </div>
                {room.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {room.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
