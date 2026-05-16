"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Send, Paperclip, Smile, Image as ImageIcon, 
  User, MessageSquare, Phone, Clock, ChevronLeft, 
  Zap, ShieldCheck, Heart
} from "lucide-react";
import { useSocket, useChatMessages, chatApi } from "@/features/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface LuxeCustomerChatProps {
  onClose?: () => void;
}

export default function LuxeCustomerChat({ onClose }: LuxeCustomerChatProps) {
  const { user } = useAuthStore();
  const roomId = user ? `room_${user.id}` : null;
  const { data: initialMessages, isLoading: messagesLoading } = useChatMessages(roomId);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const { socket, isConnected } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [staffTyping, setStaffTyping] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Socket setup
  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinRoom", { roomId });

      const handleNewMessage = (newMessage: any) => {
        if (newMessage.roomId === roomId) {
          setMessages(prev => [...prev, newMessage]);
          // If message is from staff, mark as read
          if (newMessage.senderId !== user?.id) {
             socket.emit("markAsRead", { roomId });
          }
        }
      };

      const handleTyping = (data: { userName: string; isTyping: boolean }) => {
        setStaffTyping(data.isTyping ? data.userName : null);
      };

      socket.on("newMessage", handleNewMessage);
      socket.on("userTyping", handleTyping);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping", handleTyping);
      };
    }
  }, [socket, roomId, user?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, staffTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !socket || !roomId) return;

    socket.emit("sendMessage", {
      roomId,
      message: inputText.trim(),
    });

    setInputText("");
    setIsTyping(false);
    socket.emit("typing", { roomId, isTyping: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    
    if (!isTyping && val.trim().length > 0) {
      setIsTyping(true);
      socket?.emit("typing", { roomId, isTyping: true });
    } else if (isTyping && val.trim().length === 0) {
      setIsTyping(false);
      socket?.emit("typing", { roomId, isTyping: false });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#FAF8F4] p-10 text-center rounded-[2rem] border border-[#DDD6C8] shadow-2xl">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#DDD6C8]">
          <ShieldCheck size={40} className="text-[#C4783A]" />
        </div>
        <h3 className="text-xl font-bold text-[#3D2B1A] mb-3">Vui lòng đăng nhập</h3>
        <p className="text-[#8A7966] text-sm mb-8 leading-relaxed">Để bắt đầu cuộc hội thoại với nhân viên hỗ trợ, bạn cần đăng nhập tài khoản của mình.</p>
        <button 
           onClick={() => window.location.href = "/auth/login"}
           className="px-10 py-3.5 bg-[#3D2B1A] text-white rounded-full font-bold hover:bg-[#2A2420] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-[#3D2B1A]/20"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F4] overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-[#3D2B1A] px-8 py-6 relative overflow-hidden shrink-0">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4783A] opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FAF8F4] opacity-5 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/20">
                <Heart size={20} className="text-[#F0D5BB] fill-[#F0D5BB]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#3A7D5A] border-2 border-[#3D2B1A] rounded-full" />
            </div>
            <div>
              <h3 className="text-[#FAF8F4] text-[15px] font-bold tracking-tight">LUXE Support</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-[#F0D5BB] uppercase tracking-[0.1em]">Chúng tôi đang trực tuyến</span>
              </div>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F4]/50 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#DDD6C8] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="text-center mb-8">
           <span className="px-4 py-1.5 bg-[#E8E0D0]/50 text-[#8A7966] text-[10px] font-bold rounded-full uppercase tracking-widest">Hôm nay</span>
        </div>

        {messages.length === 0 && !messagesLoading && (
          <div className="flex flex-col items-center justify-center py-10 opacity-30">
            <MessageSquare size={48} className="text-[#C4B49A] mb-4" />
            <p className="text-[13px] font-medium text-[#3D2B1A]">Bắt đầu cuộc hội thoại</p>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.senderId === user.id;
          const showTime = i === messages.length - 1 || dayjs(messages[i+1].createdAt).diff(dayjs(m.createdAt), 'minute') > 5;
          
          return (
            <div key={m.id || i} className={cn("flex gap-3 items-end group", isUser ? "flex-row-reverse" : "flex-row")}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-white border border-[#DDD6C8] flex items-center justify-center text-[11px] font-bold text-[#8B6F47] shadow-sm shrink-0">
                  LX
                </div>
              )}
              <div className={cn("max-w-[80%] flex flex-col", isUser ? "items-end" : "items-start")}>
                <div className={cn(
                  "p-3 text-[13px] leading-relaxed shadow-sm transition-all duration-300",
                  isUser 
                    ? "bg-[#3D2B1A] text-[#FAF8F4] rounded-[18px] rounded-br-none hover:bg-[#2A2420]" 
                    : "bg-white text-[#3D2B1A] border border-[#DDD6C8] rounded-[18px] rounded-bl-none hover:border-[#C4B49A]"
                )}>
                  {m.message}
                </div>
                {showTime && (
                  <div className="flex items-center gap-1.5 px-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-[#8A7966] uppercase tracking-tighter">{dayjs(m.createdAt).format("HH:mm")}</span>
                    {isUser && <span className="text-[#3A7D5A] text-[10px]">✓✓</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {staffTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-[#DDD6C8] flex items-center justify-center text-[11px] font-bold text-[#8B6F47] shadow-sm animate-pulse">
              LX
            </div>
            <div className="bg-white border border-[#DDD6C8] px-4 py-2.5 rounded-[18px] rounded-bl-none shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0s]" />
              <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#DDD6C8] shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-[#F3EFE8]/50 border border-[#DDD6C8] rounded-[20px] overflow-hidden focus-within:border-[#C4B49A] focus-within:bg-white transition-all duration-300">
            <textarea 
              placeholder="Gửi tin nhắn cho chúng tôi..."
              className="w-full p-3 bg-transparent border-none outline-none resize-none text-[13px] min-h-[44px] max-h-[100px] text-[#3D2B1A] font-medium"
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                 if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                 }
              }}
            />
            <div className="px-3 py-1.5 border-t border-[#DDD6C8]/20 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors"><Paperclip size={16} /></button>
                <button className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors"><ImageIcon size={16} /></button>
              </div>
              <div className="flex items-center gap-1">
                 <span className="text-[9px] font-bold text-[#8A7966]">{inputText.length}</span>
                 <div className="h-1.5 w-1.5 rounded-full bg-[#E8E0D0]" />
              </div>
            </div>
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={cn(
              "w-11 h-11 rounded-[18px] flex items-center justify-center transition-all transform active:scale-90 shrink-0 shadow-lg",
              inputText.trim() 
                ? "bg-[#3D2B1A] text-white hover:bg-[#2A2420] shadow-[#3D2B1A]/20" 
                : "bg-[#E8E0D0] text-[#FAF8F4] opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={18} className={cn("transition-transform", inputText.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
          </button>
        </div>
        <p className="text-center text-[9px] text-[#8A7966] font-bold uppercase tracking-widest mt-3">
          Thời gian phản hồi dự kiến: 2 phút
        </p>
      </div>
    </div>
  );
}
