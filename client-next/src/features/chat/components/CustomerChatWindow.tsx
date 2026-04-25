"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2, User, MessageSquare } from "lucide-react";
import { useSocket } from "../socket";
import { useAuthStore } from "@/store/useAuthStore";
import { chatApi } from "../api";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";

export function CustomerChatWindow() {
  const { user } = useAuthStore();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const roomId = user ? `room_${user.id}` : null;

  useEffect(() => {
    if (!roomId) return;

    // Fetch initial messages
    chatApi.getMessages(roomId).then((res) => {
      setMessages(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", { roomId });

    const handleNewMessage = (msg: any) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !roomId) return;

    socket.emit("sendMessage", {
      roomId,
      message: inputValue.trim(),
    });

    setInputValue("");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-[550px] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#1565C1] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Chat với nhân viên</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-emerald-500" : "bg-slate-300")} />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isConnected ? "Trực tuyến" : "Đang kết nối..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 custom-scrollbar"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải cuộc hội thoại...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10 space-y-4">
            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100">
              <MessageSquare className="h-10 w-10 text-slate-200" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">Chưa có tin nhắn nào</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Gửi tin nhắn cho chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng hoặc sản phẩm.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user.id;
            return (
              <div
                key={msg.id || idx}
                className={cn(
                  "flex items-end gap-3",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isMe && (
                   <div className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="h-4 w-4 text-slate-400" />
                   </div>
                )}
                <div className={cn(
                  "max-w-[75%] flex flex-col",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 text-[13px] leading-relaxed shadow-sm",
                    isMe 
                      ? "bg-[#1565C1] text-white rounded-2xl rounded-br-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-none"
                  )}>
                    {msg.message}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1.5 px-1">
                    {dayjs(msg.createdAt).format("HH:mm, DD/MM")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-6 bg-white border-t border-slate-100"
      >
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-blue-200 focus-within:bg-white transition-all">
          <input
            type="text"
            placeholder="Nhập nội dung cần hỗ trợ..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-sm py-2 px-3"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isConnected}
            className={cn(
              "p-3 rounded-xl transition-all",
              inputValue.trim() && isConnected
                ? "bg-[#1565C1] text-white hover:scale-105 active:scale-95" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
