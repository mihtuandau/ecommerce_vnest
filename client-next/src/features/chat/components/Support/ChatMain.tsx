"use client";

import React, { useRef } from "react";
import { 
  Phone, Check, MoreVertical, Send, 
  Paperclip, Image as ImageIcon, Tag, MessageSquare 
} from "lucide-react";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";

interface Message {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
}

interface ChatMainProps {
  selectedRoomId: string | null;
  selectedRoom: any;
  messages: Message[];
  messagesLoading: boolean;
  user: any;
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isShortcutMenuOpen: boolean;
  shortcuts: any[];
  onUseShortcut: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHandleInput: (val: string) => void;
}

export function ChatMain({
  selectedRoomId,
  selectedRoom,
  messages,
  messagesLoading,
  user,
  inputText,
  setInputText,
  onSendMessage,
  onKeyDown,
  isShortcutMenuOpen,
  shortcuts,
  onUseShortcut,
  messagesEndRef,
  inputRef,
  onHandleInput,
}: ChatMainProps) {
  if (!selectedRoomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
        <div className="w-24 h-24 bg-[#F1F5F9] rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-[#E2E8F0]">
          <MessageSquare size={48} className="text-[#94A3B8]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Tổng đài hỗ trợ LUXE</h2>
        <p className="text-[#64748B] max-w-sm text-sm leading-relaxed font-medium">
          Vui lòng chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center font-bold text-[#2563EB] text-[15px]">
              {selectedRoom?.customer?.name?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A]">{selectedRoom?.customer?.name || "Khách hàng"}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium">
              ID: {selectedRoomId.slice(0, 8)}...
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button title="Gọi điện" className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-all"><Phone size={17} /></button>
          <button title="Đánh dấu hoàn thành" className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#10B981] transition-all"><Check size={17} /></button>
          <button title="Thêm hành động" className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-all"><MoreVertical size={17} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC] custom-scrollbar">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-[#64748B]">Đang đồng bộ tin nhắn...</span>
            </div>
          </div>
        ) : messages.map((m, i) => {
          const isUser = m.senderId === user?.id;
          return (
            <div key={m.id || i} className={cn("flex gap-3.5 items-end", isUser ? "flex-row-reverse" : "")}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[12px] font-bold text-[#64748B] shrink-0 shadow-sm border border-white">
                  {selectedRoom?.customer?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className={cn("max-w-[75%] space-y-1.5", isUser ? "items-end" : "")}>
                <div className={cn(
                  "p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all",
                  isUser 
                    ? "bg-[#2563EB] text-white rounded-br-[2px] shadow-blue-100" 
                    : "bg-white text-[#1E293B] border border-[#E2E8F0] rounded-bl-[2px]"
                )}>
                  {m.message}
                </div>
                <div className={cn("flex items-center gap-1.5 px-1", isUser ? "justify-end" : "")}>
                  <span className="text-[10px] font-medium text-[#94A3B8]">{dayjs(m.createdAt).format("HH:mm")}</span>
                  {isUser && <span className="text-[#10B981] text-[10px] font-bold">Đã gửi</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-[#E2E8F0] relative">
        {/* Shortcut Menu */}
        {isShortcutMenuOpen && (
          <div className="absolute bottom-full left-5 right-5 mb-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className="bg-[#F8FAFC] px-4 py-2 text-[10px] font-bold text-[#64748B] uppercase tracking-widest border-b border-[#E2E8F0]">
              Phím tắt trả lời nhanh
            </div>
            {shortcuts.map((s, idx) => (
              <div 
                key={idx} 
                onClick={() => onUseShortcut(s.text)}
                className="p-3.5 hover:bg-[#EFF6FF] cursor-pointer flex gap-3 items-start border-b border-[#F1F5F9] last:border-none group transition-colors"
              >
                <span className="px-2 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-[11px] font-mono font-bold rounded">{s.key}</span>
                <div>
                  <div className="text-[13px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{s.label}</div>
                  <div className="text-[11px] text-[#64748B] line-clamp-1">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-[#3B82F6]/10 focus-within:bg-white transition-all">
            <textarea 
              ref={inputRef}
              placeholder="Nhập nội dung phản hồi... (Dùng / để hiển thị phím tắt)"
              className="w-full p-4 bg-transparent border-none outline-none resize-none text-[14px] min-h-[50px] max-h-[150px] text-[#1E293B]"
              rows={1}
              value={inputText}
              onChange={(e) => onHandleInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <div className="px-4 py-2 border-t border-[#E2E8F0]/60 flex items-center justify-between bg-white/50">
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-all"><Paperclip size={17} /></button>
                <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-all"><ImageIcon size={17} /></button>
                <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-all"><Tag size={17} /></button>
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8]">{inputText.length} / 1000</span>
            </div>
          </div>
          <button 
            onClick={onSendMessage}
            className="w-[50px] h-[50px] bg-[#2563EB] text-white rounded-2xl flex items-center justify-center hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-95 shrink-0"
          >
            <Send size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
