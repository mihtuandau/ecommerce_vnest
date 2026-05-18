"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Send, Paperclip, Smile, Image as ImageIcon, 
  User, MessageSquare, Phone, Clock, ChevronLeft, 
  Zap, ShieldCheck, Heart, ExternalLink, Bot
} from "lucide-react";
import { useSocket, useChatMessages, chatApi } from "@/features/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { productsApi } from "@/features/products/api";
import { toast } from "sonner";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface CustomerChatProps {
  onClose?: () => void;
}

export default function CustomerChat({ onClose }: CustomerChatProps) {
  const { user, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roomId = user ? `room_${user.id}` : null;
  const { data: initialMessages, isLoading: messagesLoading } = useChatMessages(roomId);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const { socket, isConnected } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [staffTyping, setStaffTyping] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isImageMessage = (msgText: string) => {
    return msgText.startsWith("http") && (msgText.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || msgText.includes("/uploads/"));
  };

  const isFileMessage = (msgText: string) => {
    return msgText.startsWith("http") && !isImageMessage(msgText);
  };

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinRoom", { roomId });

      const handleNewMessage = (newMessage: any) => {
        if (newMessage.roomId === roomId) {
          setMessages(prev => [...prev, newMessage]);
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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, staffTyping]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText.trim();
    if (!textToSend || !socket || !roomId) return;

    socket.emit("sendMessage", {
      roomId,
      message: textToSend,
    });

    if (customText === undefined) {
      setInputText("");
      setIsTyping(false);
      socket.emit("typing", { roomId, isTyping: false });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isImageOnly: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.loading(isImageOnly ? "Đang tải hình ảnh lên..." : "Đang tải tệp lên...", { id: "customer-uploading-chat" });
      
      const url = await productsApi.uploadImage(file);
      
      toast.success(isImageOnly ? "Tải ảnh lên thành công!" : "Tải tệp lên thành công!", { id: "customer-uploading-chat" });
      
      setPendingAttachment(url);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể tải tệp lên. Vui lòng thử lại!", { id: "customer-uploading-chat" });
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSend = () => {
    if (pendingAttachment) {
      handleSendMessage(pendingAttachment);
      setPendingAttachment(null);
    }
    if (inputText.trim()) {
      handleSendMessage();
    }
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

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-[#FAF8F4]/20 p-8 text-center font-sans">
        <div className="w-8 h-8 border-2 border-[#C4783A]/20 border-t-[#C4783A] rounded-full animate-spin mb-4" />
        <p className="text-[12px] text-[#8A7966] font-normal tracking-wide lowercase">đang kết nối LUXE Care...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-[#FAF8F4]/40 p-8 text-center font-sans">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-3xs border border-[#DDD6C8]/60 relative ring-4 ring-[#E8E0D0]/30">
          <ShieldCheck size={24} className="text-[#3D2B1A]" />
        </div>
        <h3 className="text-[14px] font-semibold text-[#3D2B1A] mb-1.5">Vui lòng đăng nhập</h3>
        <p className="text-[#8A7966] text-[12px] mb-5 max-w-xs leading-relaxed">Để bắt đầu trò chuyện trực tuyến với hỗ trợ viên, vui lòng đăng nhập tài khoản của bạn.</p>
        <button 
           onClick={() => window.location.href = "/auth/login"}
           className="px-5 py-2.5 bg-[#3D2B1A] text-white rounded-xl text-[12px] font-medium hover:bg-[#2A2420] active:scale-98 transition-all shadow-md shadow-[#3D2B1A]/10"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden font-sans border-0">
      <div className="bg-white border-b border-[#DDD6C8]/40 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-[#FAF8F4] rounded-xl flex items-center justify-center border border-[#DDD6C8]/60 shadow-3xs overflow-hidden relative">
              <Bot size={18} className="text-[#C4783A]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="text-[#3D2B1A] text-[13px] font-semibold">Hỗ trợ viên LUXE</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#8A7966] lowercase">Đang hoạt động trực tuyến</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FAF8F4] hover:bg-[#FAF8F4]/80 text-[#8A7966] hover:text-[#3D2B1A] transition-colors border border-[#DDD6C8]/30"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#E8E0D0] [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {messages.length === 0 && !messagesLoading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <MessageSquare size={32} className="text-[#C4B49A] mb-3" />
            <p className="text-[12px] text-[#8A7966] font-normal">Bắt đầu cuộc trò chuyện với LUXE Care</p>
          </div>
        )}

        {messages.filter(m => !m.message.startsWith("[INTERNAL]")).map((m, i, filteredList) => {
          const isUser = m.senderId === user.id;
          const showTime = i === filteredList.length - 1 || dayjs(filteredList[i+1].createdAt).diff(dayjs(m.createdAt), 'minute') > 5;
          
          return (
            <div key={m.id || i} className={cn("flex gap-2.5 items-end group", isUser ? "flex-row-reverse" : "flex-row")}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#FAF8F4] border border-[#DDD6C8]/60 flex items-center justify-center text-[9px] font-medium text-[#8A7966] shadow-3xs shrink-0 overflow-hidden">
                  VN
                </div>
              )}
              <div className={cn("max-w-[75%] flex flex-col", isUser ? "items-end" : "items-start")}>
                {isImageMessage(m.message) ? (
                  <div className="rounded-xl overflow-hidden shadow-3xs border border-[#DDD6C8]/40 bg-white p-1 hover:scale-101 transition-transform">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={m.message} 
                      alt="Attachment" 
                      className="max-w-[200px] max-h-[150px] rounded-lg object-cover cursor-pointer" 
                      onClick={() => window.open(m.message, "_blank")} 
                    />
                  </div>
                ) : (
                  <div className={cn(
                    "p-2.5 text-[12px] leading-relaxed shadow-3xs transition-all duration-200",
                    isUser 
                      ? "bg-[#3D2B1A] text-white rounded-2xl rounded-br-xs hover:bg-[#2A2420]" 
                      : "bg-white text-[#3D2B1A] border border-[#DDD6C8]/55 rounded-2xl rounded-bl-xs hover:border-[#C4B49A]"
                  )}>
                    {isFileMessage(m.message) ? (
                      <a 
                        href={m.message} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={cn(
                          "flex items-center gap-1.5 p-1.5 rounded-lg border transition-colors text-[11px]",
                          isUser 
                            ? "border-stone-700 bg-stone-800 text-stone-100 hover:bg-stone-900" 
                            : "border-[#FAF8F4] bg-[#FAF8F4] text-[#3D2B1A] hover:bg-[#FAF8F4]/80"
                        )}
                      >
                        <Paperclip size={12} className="shrink-0 text-[#8A7966]" />
                        <span className="truncate max-w-[130px] font-normal">Tải tệp đính kèm</span>
                        <ExternalLink size={10} className="shrink-0 opacity-60" />
                      </a>
                    ) : (
                      m.message
                    )}
                  </div>
                )}
                {showTime && (
                  <div className="flex items-center gap-1 px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] text-[#8A7966] lowercase">{dayjs(m.createdAt).format("HH:mm")}</span>
                    {isUser && <span className="text-[#C4783A] text-[9px]">✓</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {staffTyping && (
          <div className="flex gap-2.5 items-center">
            <div className="w-7 h-7 rounded-lg bg-[#FAF8F4] border border-[#DDD6C8]/60 flex items-center justify-center text-[9px] font-medium text-[#8A7966] shadow-3xs shrink-0">
              VN
            </div>
            <div className="bg-white border border-[#DDD6C8]/40 px-3.5 py-2.5 rounded-2xl rounded-bl-xs shadow-3xs flex gap-1 items-center">
              <div className="w-1.2 h-1.2 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0s]" />
              <div className="w-1.2 h-1.2 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.2 h-1.2 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[#DDD6C8]/40 shrink-0">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileChange(e, false)} 
          className="hidden" 
          accept="*/*"
        />
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={(e) => handleFileChange(e, true)} 
          className="hidden" 
          accept="image/*"
        />

        <div className="flex items-end gap-2.5">
          <div className="flex-1 bg-[#FAF8F4]/40 border border-[#DDD6C8]/60 rounded-2xl overflow-hidden focus-within:border-[#C4B49A] focus-within:bg-white transition-all duration-300 flex flex-col">
            {pendingAttachment && (
              <div className="px-3 pt-3 pb-1 flex bg-white border-b border-[#DDD6C8]/10 shrink-0">
                <div className="relative inline-block bg-[#FAF8F4] border border-[#DDD6C8]/55 rounded-xl p-1 shadow-3xs group animate-in zoom-in-95 duration-200">
                  {isImageMessage(pendingAttachment) ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={pendingAttachment} 
                        alt="Attachment Preview" 
                        className="w-11 h-11 rounded-lg object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-stone-100 border border-stone-250">
                      <Paperclip size={16} className="text-stone-400" />
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-3xs border border-white"
                  >
                    <X size={8} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}
            <textarea 
              placeholder="Gửi tin nhắn hỗ trợ trực tuyến..."
              className="w-full p-3 bg-transparent border-none outline-none resize-none text-[12px] min-h-[40px] max-h-[80px] text-[#3D2B1A] font-normal placeholder-[#8A7966]/60 focus:ring-0"
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                 if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                 }
              }}
            />
            <div className="px-3 py-1.5 border-t border-[#DDD6C8]/10 flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Paperclip size={14} />
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-[#8A7966] hover:text-[#3D2B1A] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <ImageIcon size={14} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                 <span className="text-[8px] text-[#8A7966]">{inputText.length}</span>
                 <div className="h-1 w-1 rounded-full bg-[#E8E0D0]" />
              </div>
            </div>
          </div>
          <button 
            onClick={handleSend}
            disabled={(!inputText.trim() && !pendingAttachment) || isUploading}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all transform active:scale-95 shrink-0 shadow-3xs cursor-pointer",
              (inputText.trim() || pendingAttachment) && !isUploading
                ? "bg-[#3D2B1A] text-white hover:bg-[#2A2420] shadow-lg shadow-[#3D2B1A]/15" 
                : "bg-[#E8E0D0]/50 text-white opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={15} className={cn("transition-transform", (inputText.trim() || pendingAttachment) ? "translate-x-0.5" : "")} />
          </button>
        </div>
      </div>
    </div>
  );
}
