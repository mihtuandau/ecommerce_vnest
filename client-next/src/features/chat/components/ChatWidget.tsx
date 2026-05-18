"use client";

import React, { useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useChatWidget } from "@/features/chat/hooks/useChatWidget";
import { ChatProductCard } from "./Widget/ChatProductCard";
import { ChatDiscountCard } from "./Widget/ChatDiscountCard";

export function ChatWidget() {
  const {
    isOpen,
    setIsOpen,
    message,
    setMessage,
    messages,
    isLoading,
    handleSendMessage,
    clearHistory
  } = useChatWidget();

  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = [
    "Tư vấn Laptop đồ họa",
    "Quà tặng dưới 5 triệu",
    "iPhone mới nhất",
    "Chính sách bảo hành",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-12 right-6 z-[9999] hidden md:flex flex-col items-end gap-4">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-full max-w-[420px] h-[640px] bg-[#FAF8F4] shadow-[0_32px_64px_rgba(61,43,26,0.15)] rounded-[2.5rem] border border-[#DDD6C8] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 font-sans">
          {/* AI Header */}
          <div className="bg-[#3D2B1A] px-6 py-5 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4783A] opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FAF8F4] opacity-5 rounded-full blur-2xl -ml-12 -mb-12" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/20">
                    <Sparkles size={20} className="text-[#F0D5BB] animate-pulse" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#3D2B1A] rounded-full" />
                </div>
                <div>
                  <h3 className="text-[#FAF8F4] text-[15px] font-bold tracking-tight">Trợ lý Mua sắm AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-[#F0D5BB] uppercase tracking-[0.1em]">Sẵn sàng hỗ trợ bạn 24/7</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F4]/50 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#DDD6C8] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {messages.map((msg, index) => {
              const isBot = msg.role === "bot";
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 w-full group",
                    isBot ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {isBot && (
                    <div className="h-8 w-8 rounded-full bg-white border border-[#DDD6C8] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm font-bold text-[#8B6F47] text-[11px]">
                      AI
                    </div>
                  )}
                  <div className={cn("flex flex-col max-w-[85%]", isBot ? "items-start" : "items-end")}>
                    <div
                      className={cn(
                        "p-3.5 rounded-[20px] text-[13.5px] leading-relaxed w-full break-words shadow-sm transition-all duration-300",
                        isBot
                          ? "bg-white text-[#3D2B1A] rounded-tl-none border border-[#DDD6C8] hover:border-[#C4B49A]"
                          : "bg-[#3D2B1A] text-[#FAF8F4] rounded-tr-none hover:bg-[#2A2420]"
                      )}
                    >
                      {msg.content.replace(/\[\s*(ids?|suggests?|code)\s*:[^\]]+\]/gi, "").trim()}

                      {isBot && msg.discounts?.map((d: any, i: number) => (
                        <ChatDiscountCard key={i} discount={d} />
                      ))}

                      {isBot && msg.productIds?.map((id: number) => (
                        <ChatProductCard key={id} productId={id} salePrice={msg.flashSalePrice?.[id]} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-white border border-[#DDD6C8] flex items-center justify-center shadow-sm font-bold text-[#8B6F47] text-[11px] animate-pulse">
                  AI
                </div>
                <div className="bg-white border border-[#DDD6C8] px-4 py-3 rounded-[18px] rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0s]" />
                  <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-[#C4B49A] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Dynamic Suggestions */}
          {!isLoading && (
            <div className="px-6 py-4 flex flex-wrap gap-2 bg-white border-t border-[#DDD6C8]/50 shrink-0">
              {(
                messages[messages.length - 1]?.suggestions ||
                (messages.length < 3 ? SUGGESTIONS : [])
              ).map((s: string, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    if (s.toLowerCase().includes("mới")) {
                      clearHistory();
                      return;
                    }
                    handleSendMessage(s);
                  }}
                  className="px-4 py-1.5 bg-[#F3EFE8] hover:bg-[#3D2B1A] hover:text-white border border-[#DDD6C8] rounded-full text-[11px] font-bold text-[#8A7966] transition-all duration-300 shadow-sm uppercase tracking-tighter"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* AI Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(message);
            }}
            className="p-6 bg-white border-t border-[#DDD6C8] shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#F3EFE8]/80 border-2 border-[#DDD6C8] rounded-2xl overflow-hidden focus-within:border-[#C4B49A] focus-within:bg-white transition-all duration-300">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hỏi trợ lý AI..."
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-transparent border-none outline-none text-[14px] text-[#3D2B1A] font-medium placeholder:text-[#8A7966]/60"
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform active:scale-90 shrink-0 shadow-lg",
                  message.trim() && !isLoading
                    ? "bg-[#3D2B1A] text-white hover:bg-[#2A2420] shadow-[#3D2B1A]/20"
                    : "bg-[#E8E0D0] text-[#FAF8F4] opacity-50 cursor-not-allowed"
                )}
              >
                <Send size={20} className={cn("transition-transform", message.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-white transition-all duration-500 hover:scale-110 active:scale-95 relative group",
          isOpen ? "bg-[#3D2B1A] rotate-90 shadow-[#3D2B1A]/40" : "bg-[#3D2B1A] shadow-[#3D2B1A]/20"
        )}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={28} className="group-hover:rotate-12 transition-transform text-[#F0D5BB]" />}
        {!isOpen && <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />}
      </button>
    </div>
  );
}
