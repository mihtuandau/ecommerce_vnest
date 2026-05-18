"use client";

import React from "react";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import { Paperclip, ExternalLink, Lock } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender?: {
    name: string;
    role: string;
  };
}

interface MessageBubbleProps {
  m: Message;
  i: number;
  user: any;
  selectedRoomId: string | null;
  selectedRoom: any;
}

const isImageMessage = (msgText: string) => {
  return msgText.startsWith("http") && (msgText.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || msgText.includes("/uploads/"));
};

const isFileMessage = (msgText: string) => {
  return msgText.startsWith("http") && !isImageMessage(msgText);
};

export function MessageBubble({
  m,
  i,
  user,
  selectedRoomId,
  selectedRoom,
}: MessageBubbleProps) {
  const isUser = m.senderId === user?.id;
  const isInternal = m.message.startsWith("[INTERNAL] ");
  const displayMessage = isInternal ? m.message.substring(11) : m.message;

  if (isInternal) {
    return (
      <div key={m.id || i} className="w-full flex justify-center my-2 animate-in fade-in duration-200">
        <div className="max-w-[85%] bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 shadow-sm text-xs text-amber-900 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 shadow-xs border border-amber-200">
            <Lock size={14} strokeWidth={2.5} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-amber-800 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                Ghi chú nội bộ
              </span>
              <span className="text-[9px] font-medium text-amber-500">{dayjs(m.createdAt).format("HH:mm")}</span>
            </div>
            <div className="text-[13px] leading-relaxed font-medium">
              {isImageMessage(displayMessage) ? (
                <div className="rounded-xl overflow-hidden border border-amber-200 bg-white p-1 mt-1.5 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={displayMessage} 
                    alt="Internal Attachment" 
                    className="max-w-[200px] max-h-[150px] rounded-lg object-cover cursor-pointer"
                    onClick={() => window.open(displayMessage, "_blank")} 
                  />
                </div>
              ) : isFileMessage(displayMessage) ? (
                <a 
                  href={displayMessage} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 p-2 rounded-xl border border-amber-200 bg-amber-100/30 text-amber-850 hover:bg-amber-100/60 transition-colors mt-1.5 inline-flex"
                >
                  <Paperclip size={13} className="shrink-0" />
                  <span className="text-xs font-medium truncate max-w-[180px]">Tải tệp đính kèm nội bộ</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60" />
                </a>
              ) : (
                displayMessage
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isStaffRoom = selectedRoomId?.startsWith("room_staff_");
  const senderName = m.sender?.name || "Nhân viên";
  const senderRole = m.sender?.role || "Staff";
  const initials = senderName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "NV";

  return (
    <div key={m.id || i} className={cn("flex gap-3.5 items-end", isUser ? "flex-row-reverse" : "")}>
      {!isUser && (
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border shadow-xs",
          isStaffRoom 
            ? "bg-amber-100 text-amber-750 border-amber-200" 
            : "bg-slate-200 text-slate-500 border-white"
        )}>
          {isStaffRoom ? initials : (selectedRoom?.customer?.name?.charAt(0).toUpperCase() || "U")}
        </div>
      )}
      <div className={cn("max-w-[75%] space-y-1.5 flex flex-col", isUser ? "items-end" : "items-start")}>
        {isStaffRoom && !isUser && (
          <div className="text-[10px] font-bold text-slate-500 mb-0.5 flex items-center gap-1.5 animate-in fade-in duration-200">
            <span>{senderName}</span>
            <span className="px-1 py-0.2 bg-amber-50 border border-amber-200 text-amber-750 text-[7px] uppercase tracking-wider font-bold rounded shrink-0">
              {senderRole}
            </span>
          </div>
        )}
        {isImageMessage(m.message) ? (
          <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-100/80 bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={m.message} 
              alt="Attachment" 
              className="max-w-[240px] max-h-[180px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={() => window.open(m.message, "_blank")} 
            />
          </div>
        ) : (
          <div className={cn(
            "p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all",
            isUser 
              ? "bg-indigo-600 text-white rounded-br-[2px]" 
              : isStaffRoom
                ? "bg-amber-50/60 text-slate-800 border border-amber-200/60 rounded-bl-[2px]"
                : "bg-white text-slate-750 border border-slate-100 rounded-bl-[2px]"
          )}>
            {isFileMessage(m.message) ? (
              <a 
                href={m.message} 
                target="_blank" 
                rel="noreferrer" 
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl border transition-colors",
                  isUser 
                    ? "border-indigo-500 bg-indigo-700/30 text-white hover:bg-indigo-800" 
                    : isStaffRoom
                      ? "border-amber-200 bg-amber-100/20 text-amber-800 hover:bg-amber-100/40"
                      : "border-slate-100 bg-slate-550/10 text-indigo-600 hover:bg-slate-100"
                )}
              >
                <Paperclip size={13} className="shrink-0" />
                <span className="text-xs font-medium truncate max-w-[180px]">Tải tệp đính kèm</span>
                <ExternalLink size={10} className="shrink-0 opacity-60" />
              </a>
            ) : (
              m.message
            )}
          </div>
        )}
        <div className={cn("flex items-center gap-1.5 px-1", isUser ? "justify-end" : "")}>
          <span className="text-[9px] font-medium text-slate-400">{dayjs(m.createdAt).format("HH:mm")}</span>
          {isUser && <span className="text-emerald-600 text-[9px] font-bold">Đã gửi</span>}
        </div>
      </div>
    </div>
  );
}
