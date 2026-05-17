"use client";

import React, { useRef, useState } from "react";
import { 
  Phone, Check, MoreVertical, Send, 
  Paperclip, Image as ImageIcon, Tag, MessageSquare, ExternalLink, X, Lock 
} from "lucide-react";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import { productsApi } from "@/features/products/api";
import { toast } from "sonner";

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

interface ChatMainProps {
  selectedRoomId: string | null;
  selectedRoom: any;
  messages: Message[];
  messagesLoading: boolean;
  user: any;
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (customText?: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isShortcutMenuOpen: boolean;
  setIsShortcutMenuOpen: (open: boolean) => void;
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
  setIsShortcutMenuOpen,
  shortcuts,
  onUseShortcut,
  messagesEndRef,
  inputRef,
  onHandleInput,
}: ChatMainProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<string | null>(null);

  const isImageMessage = (msgText: string) => {
    return msgText.startsWith("http") && (msgText.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || msgText.includes("/uploads/"));
  };

  const isFileMessage = (msgText: string) => {
    return msgText.startsWith("http") && !isImageMessage(msgText);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isImageOnly: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.loading(isImageOnly ? "Đang tải hình ảnh lên..." : "Đang tải tệp lên...", { id: "uploading-chat" });
      
      const url = await productsApi.uploadImage(file);
      
      toast.success(isImageOnly ? "Tải ảnh lên thành công!" : "Tải tệp lên thành công!", { id: "uploading-chat" });
      
      // Store the uploaded attachment URL in local pending draft state
      setPendingAttachment(url);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể tải tệp lên. Vui lòng thử lại!", { id: "uploading-chat" });
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSend = () => {
    if (pendingAttachment) {
      onSendMessage(pendingAttachment);
      setPendingAttachment(null);
    }
    if (inputText.trim()) {
      onSendMessage();
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedRoomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100 animate-pulse">
          <MessageSquare size={36} className="text-slate-350" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Tổng đài hỗ trợ LUXE</h2>
        <p className="text-slate-400 max-w-xs text-xs leading-relaxed font-medium">
          Vui lòng chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Hidden File Inputs */}
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

      <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        {selectedRoomId?.startsWith("room_staff_") ? (
          (() => {
            const isInternalGroup = selectedRoomId === "room_staff_internal";
            const initials = selectedRoom?.customer?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "NV";
            return (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-sm border border-amber-200 shadow-xs">
                    {isInternalGroup ? "👥" : initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {isInternalGroup ? "Kênh Nội Bộ Cửa Hàng" : selectedRoom?.customer?.name}
                    <span className="text-[9px] bg-amber-100 border border-amber-200/50 text-amber-800 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                      {isInternalGroup ? "Nhân viên" : selectedRoom?.customer?.role}
                    </span>
                  </h3>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {isInternalGroup 
                      ? "Kênh trao đổi & thông báo nội bộ giữa các bộ phận" 
                      : "Trò chuyện trực tiếp & bảo mật nội bộ"
                    }
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-slate-550/10 flex items-center justify-center font-semibold text-slate-500 text-sm shadow-xs border border-slate-100">
                {selectedRoom?.customer?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{selectedRoom?.customer?.name || "Khách hàng"}</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                {selectedRoom?.customer?.email || selectedRoom?.customer?.phone || "Khách hàng trực tuyến 🟢"}
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {!selectedRoomId?.startsWith("room_staff_") && (
            <>
              <button title="Gọi điện" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-550/10 hover:text-indigo-600 transition-all cursor-pointer"><Phone size={15} /></button>
              <button title="Đánh dấu hoàn thành" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-555/10 hover:text-emerald-600 transition-all cursor-pointer"><Check size={15} /></button>
            </>
          )}
          <button title="Thêm hành động" className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-550/10 hover:text-indigo-600 transition-all cursor-pointer"><MoreVertical size={15} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-slate-400">Đang đồng bộ tin nhắn...</span>
            </div>
          </div>
        ) : messages.map((m, i) => {
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
                              : "border-slate-100 bg-slate-50 text-indigo-600 hover:bg-slate-100"
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
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-slate-100 relative">
        {/* Shortcut Menu */}
        {isShortcutMenuOpen && (
          <div className="absolute bottom-full left-5 right-5 mb-3 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className="bg-slate-50/70 px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              Phím tắt trả lời nhanh
            </div>
            {shortcuts.map((s, idx) => (
              <div 
                key={idx} 
                onClick={() => onUseShortcut(s.text)}
                className="p-3.5 hover:bg-slate-50/50 cursor-pointer flex gap-3 items-start border-b border-slate-100 last:border-none group transition-colors"
              >
                <span className="px-2 py-0.5 bg-slate-100 text-slate-650 text-[10px] font-mono font-semibold rounded">{s.key}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-650 transition-colors">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className={cn(
            "flex-1 bg-slate-50/50 border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:bg-white transition-all flex flex-col",
            selectedRoomId?.startsWith("room_staff_")
              ? "border-amber-250 focus-within:border-amber-500 focus-within:ring-amber-500/10"
              : "border-slate-200 focus-within:border-indigo-600 focus-within:ring-indigo-600/10"
          )}>
            {pendingAttachment && (
              <div className="px-4 pt-3 pb-1.5 flex bg-white border-b border-slate-100 shrink-0">
                <div className="relative inline-block bg-slate-50 border border-slate-200/80 rounded-xl p-1 shadow-xs group animate-in zoom-in-95 duration-200">
                  {isImageMessage(pendingAttachment) ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={pendingAttachment} 
                        alt="Attachment Preview" 
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200">
                      <Paperclip size={20} className="text-slate-400" />
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-sm border border-white"
                  >
                    <X size={9} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}
            <textarea 
              ref={inputRef}
              placeholder={
                selectedRoomId?.startsWith("room_staff_")
                  ? "Nhập tin nhắn trao đổi nội bộ với các nhân viên khác..."
                  : "Nhập nội dung phản hồi... (Dùng / hoặc bấm nút nhãn để xem phím tắt)"
              }
              className="w-full p-4 bg-transparent border-none outline-none resize-none text-xs min-h-[50px] max-h-[150px] text-slate-700"
              rows={1}
              value={inputText}
              onChange={(e) => onHandleInput(e.target.value)}
              onKeyDown={handleLocalKeyDown}
            />
            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between bg-white/50">
              <div className="flex gap-1">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Đính kèm tệp" 
                  disabled={isUploading}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-50",
                    selectedRoomId?.startsWith("room_staff_")
                      ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" 
                      : "text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10"
                  )}
                >
                  <Paperclip size={15} />
                </button>
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Đính kèm hình ảnh" 
                  disabled={isUploading}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-50",
                    selectedRoomId?.startsWith("room_staff_")
                      ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" 
                      : "text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10"
                  )}
                >
                  <ImageIcon size={15} />
                </button>
                {!selectedRoomId?.startsWith("room_staff_") && (
                  <button 
                    type="button"
                    onClick={() => setIsShortcutMenuOpen(!isShortcutMenuOpen)}
                    title="Tin nhắn nhanh" 
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Tag size={15} />
                  </button>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-400">{inputText.length} / 1000</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleSend}
            className={cn(
              "w-[50px] h-[50px] text-white rounded-2xl flex items-center justify-center transition-all shadow-sm transform active:scale-95 shrink-0 cursor-pointer",
              selectedRoomId?.startsWith("room_staff_")
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
