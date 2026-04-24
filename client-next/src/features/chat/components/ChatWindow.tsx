"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, Send, Loader2, Smile } from "lucide-react";
import { useChatMessages, useSocket, ChatMessage } from "@/features/chat";
import { cn } from "@/utils/cn";
import { useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
  roomId: string | null;
}

export function ChatWindow({ roomId }: ChatWindowProps) {
  const queryClient = useQueryClient();
  const { data: initialMessages, isLoading } = useChatMessages(roomId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { socket, isConnected } = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", { roomId });

    const handleNewMessage = (msg: ChatMessage) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
        // Also invalidate rooms list to update last message
        queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, roomId, queryClient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !roomId) return;

    socket.emit("sendMessage", {
      roomId,
      message: inputValue.trim(),
    });

    setInputValue("");
  };

  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50">
        <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
           <User className="h-10 w-10 text-slate-200" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Bắt đầu trò chuyện</h3>
        <p className="text-sm font-medium mt-2">Chọn một khách hàng từ danh sách để hỗ trợ.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <User className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Phòng {roomId}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-emerald-500" : "bg-slate-300")} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isConnected ? "Đang trực tuyến" : "Ngoại tuyến"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải tin nhắn...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.role !== "CUSTOMER";
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
            const isNextMe = idx < messages.length - 1 && messages[idx + 1].senderId === msg.senderId;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-3 transition-all duration-300",
                  isMe ? "flex-row-reverse" : "flex-row",
                  !isNextMe && "mb-4"
                )}
              >
                {!isMe && (
                   <div className={cn(
                     "h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 transition-opacity duration-300", 
                     !showAvatar ? "opacity-0" : "opacity-100"
                   )}>
                      <User className="h-4 w-4 text-slate-300" />
                   </div>
                )}
                
                <div className={cn(
                  "max-w-[75%] space-y-1.5 flex flex-col",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-2.5 text-[13px] font-medium leading-relaxed transition-all duration-200",
                    isMe 
                      ? "bg-slate-900 text-white rounded-2xl rounded-br-none hover:bg-slate-800" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-none hover:border-slate-200"
                  )}>
                    {msg.message}
                  </div>
                  {(!isNextMe || showAvatar) && (
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter px-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-slate-300 focus-within:bg-white transition-all duration-200">
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Smile className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              inputValue.trim() 
                ? "bg-slate-900 text-white hover:scale-105 active:scale-95" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
