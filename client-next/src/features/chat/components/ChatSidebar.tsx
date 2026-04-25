"use client";

import React, { useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useChatRooms } from "@/features/chat";
import { cn } from "@/utils/cn";
import { Role } from "@/types/enums";
import { chatApi } from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useQueryClient } from "@tanstack/react-query";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ChatSidebarProps {
  selectedRoom: string | null;
  onSelectRoom: (room: any) => void;
}

export function ChatSidebar({ selectedRoom, onSelectRoom }: ChatSidebarProps) {
  const queryClient = useQueryClient();
  const { data: rooms, isLoading } = useChatRooms();
  const [search, setSearch] = useState("");

  const handleSelectRoom = (room: any) => {
    onSelectRoom(room);
    
    // Đánh dấu đã đọc ngay lập tức trong bộ nhớ đệm (Optimistic Update)
    queryClient.setQueryData(["chat-rooms"], (oldData: any) => {
      if (!oldData) return oldData;
      return oldData.map((r: any) => 
        r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r
      );
    });

    // Gọi API để Backend cập nhật trạng thái đã đọc
    chatApi.markAsRead(room.roomId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    });
  };

  const filteredRooms = rooms?.filter((room) =>
    room.lastMessage.sender.name.toLowerCase().includes(search.toLowerCase()) ||
    room.roomId.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (date: string) => {
    const d = dayjs(date);
    const now = dayjs();
    
    if (now.diff(d, 'hour') < 24) {
      return d.fromNow();
    }
    if (now.diff(d, 'day') < 7) {
      return d.format("ddd");
    }
    return d.format("DD/MM");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-7 pb-5 border-b border-slate-100 space-y-4">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hội thoại</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <Input
            placeholder="Tìm theo tên..."
            className="h-10 pl-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-100 rounded-xl text-[13px] font-medium placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
             <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-200" />
             </div>
             <p className="text-sm font-medium">Không tìm thấy hội thoại</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredRooms?.map((room) => {
              const isActive = selectedRoom === room.roomId;
              const lastMsg = room.lastMessage;
              const sender = lastMsg.sender;
              const isCustomerMsg = sender.role === Role.CUSTOMER;

              return (
                <button
                  key={room.roomId}
                  onClick={() => handleSelectRoom(room)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 group relative border-2",
                    isActive 
                      ? "bg-slate-50 border-slate-100" 
                      : "hover:bg-slate-50/50 border-transparent text-slate-600"
                  )}
                >
                  <div className={cn(
                    "relative h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                    isActive ? "border-white bg-white" : "border-white bg-slate-100"
                  )}>
                    <User className={cn("h-6 w-6", isActive ? "text-slate-900" : "text-slate-400")} />
                    {room.unreadCount > 0 && (
                       <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                          {room.unreadCount}
                       </span>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-sm font-black truncate",
                        isActive ? "text-slate-900" : "text-slate-600"
                      )}>
                        {room.customer?.name || (isCustomerMsg ? sender.name : "Khách hàng")}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                        {formatTime(lastMsg.createdAt)}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-slate-500" : "text-slate-400",
                      room.unreadCount > 0 && !isActive && "font-black text-slate-900"
                    )}>
                      {lastMsg.message}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
