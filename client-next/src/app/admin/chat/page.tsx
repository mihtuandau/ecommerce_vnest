"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

import { ChatSidebar, ChatWindow } from "@/features/chat";

export default function AdminChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-6 bg-slate-50/30">
      {/* Header Area */}
      <div className="p-6 pb-4 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hỗ trợ trực tuyến</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Trung tâm điều hành hỗ trợ khách hàng
        </p>
      </div>

      {/* Unified Chat Container */}
      <div className="flex-1 mx-6 mb-6 bg-white rounded-3xl border border-slate-200 overflow-hidden flex">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] w-full h-full">
          {/* Sidebar */}
          <div className="h-full border-r border-slate-100 overflow-hidden">
            <ChatSidebar 
              selectedRoom={selectedRoom?.roomId} 
              onSelectRoom={(room: any) => setSelectedRoom(room)} 
            />
          </div>

          {/* Chat Window */}
          <div className="h-full overflow-hidden bg-white">
            <ChatWindow 
              roomId={selectedRoom?.roomId} 
              customerName={selectedRoom?.customer?.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
