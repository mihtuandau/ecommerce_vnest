"use client";

import React, { useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { productsApi } from "@/features/products/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";

import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ShortcutMenu } from "./ShortcutMenu";

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
  onSendMessage,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isImageOnly: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.loading(isImageOnly ? "Đang tải hình ảnh lên..." : "Đang tải tệp lên...", { id: "uploading-chat" });
      
      const url = await productsApi.uploadImage(file);
      
      toast.success(isImageOnly ? "Tải ảnh lên thành công!" : "Tải tệp lên thành công!", { id: "uploading-chat" });
      
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
        <Skeleton className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
          <MessageSquare size={36} className="text-slate-350" />
        </Skeleton>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Tổng đài hỗ trợ LUXE</h2>
        <p className="text-slate-400 max-w-xs text-xs leading-relaxed font-medium">
          Vui lòng chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
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

      <ChatHeader selectedRoomId={selectedRoomId} selectedRoom={selectedRoom} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" className="text-indigo-600" />
              <span className="text-xs font-semibold text-slate-400">Đang đồng bộ tin nhắn...</span>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <MessageBubble 
              key={m.id || i}
              m={m} 
              i={i} 
              user={user} 
              selectedRoomId={selectedRoomId} 
              selectedRoom={selectedRoom} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-slate-100 relative">
        <ShortcutMenu 
          isShortcutMenuOpen={isShortcutMenuOpen} 
          shortcuts={shortcuts} 
          onUseShortcut={onUseShortcut} 
        />

        <div className="flex items-end gap-3">
          <div className={`flex-1 bg-slate-50/50 border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:bg-white transition-all flex flex-col ${
            selectedRoomId?.startsWith("room_staff_")
              ? "border-amber-250 focus-within:border-amber-500 focus-within:ring-amber-500/10"
              : "border-slate-200 focus-within:border-indigo-600 focus-within:ring-indigo-600/10"
          }`}>
            {pendingAttachment && (
              <div className="px-4 pt-3 pb-1.5 flex bg-white border-b border-slate-100 shrink-0">
                <div className="relative inline-block bg-slate-50 border border-slate-200/80 rounded-xl p-1 shadow-xs group animate-in zoom-in-95 duration-200">
                  {isImageMessage(pendingAttachment) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={pendingAttachment} 
                      alt="Attachment Preview" 
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-450 uppercase">File</span>
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-sm border border-white"
                  >
                    <span className="text-[9px] font-bold">✕</span>
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
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                    selectedRoomId?.startsWith("room_staff_")
                      ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" 
                      : "text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10"
                  }`}
                >
                  <span className="text-sm">📎</span>
                </button>
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Đính kèm hình ảnh" 
                  disabled={isUploading}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                    selectedRoomId?.startsWith("room_staff_")
                      ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" 
                      : "text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10"
                  }`}
                >
                  <span className="text-sm">🖼️</span>
                </button>
                {!selectedRoomId?.startsWith("room_staff_") && (
                  <button 
                    type="button"
                    onClick={() => setIsShortcutMenuOpen(!isShortcutMenuOpen)}
                    title="Tin nhắn nhanh" 
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-550/10 rounded-lg transition-all cursor-pointer"
                  >
                    <span className="text-sm">🏷️</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-400">{inputText.length} / 1000</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleSend}
            className={`w-[50px] h-[50px] text-white rounded-2xl flex items-center justify-center transition-all shadow-sm transform active:scale-95 shrink-0 cursor-pointer ${
              selectedRoomId?.startsWith("room_staff_")
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <span className="text-lg">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
