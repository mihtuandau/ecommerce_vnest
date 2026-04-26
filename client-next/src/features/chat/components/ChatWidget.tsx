"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Sparkles, MessageSquare } from "lucide-react";
import { chatApi } from "../api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      content: "Xin chào! Tôi là trợ lý ảo của Vnest. Tôi có thể giúp gì cho bạn?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage("");
    
    const newUserMsg = {
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await chatApi.chatbotChat(userMsg);
      
      const botMsg = {
        role: "bot",
        content: response.message,
        timestamp: response.timestamp || new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Xin lỗi, tôi đang gặp chút sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé!",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-[420px] h-[600px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* AI Header */}
          <div className="bg-primary p-6 flex items-center justify-between text-white relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Bot size={26} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Trợ lý ảo AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-blue-100 font-medium">Sẵn sàng hỗ trợ bạn</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => {
                   setIsOpen(false);
                   window.location.href = "/support";
                }}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2 text-[11px] font-medium transition-all border border-white/10"
              >
                <MessageSquare size={14} />
                Nhân viên
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 custom-scrollbar"
          >
            {messages.map((msg, index) => {
              const isBot = msg.role === "bot";
              return (
                <div 
                  key={index} 
                  className={cn("flex items-end gap-3", isBot ? "flex-row" : "flex-row-reverse")}
                >
                  {isBot && (
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                      <Bot size={18} className="text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "flex flex-col max-w-[80%]",
                    isBot ? "items-start" : "items-end"
                  )}>
                    <div 
                      className={cn(
                        "p-4 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm",
                        isBot 
                          ? "bg-white text-slate-700 rounded-bl-none border border-slate-100" 
                          : "bg-primary text-white rounded-br-none"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex items-end gap-3">
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                  <Bot size={18} className="text-primary/40" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-bl-none">
                  <div className="flex gap-1.5">
                    <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce" />
                    <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-6 bg-white border-t border-slate-50 flex items-center gap-3"
          >
            <div className="flex-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex items-center focus-within:border-primary/20 focus-within:bg-white transition-all duration-300">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bạn muốn hỏi gì..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-sm py-2.5 px-4"
              />
              <button 
                type="submit"
                disabled={!message.trim() || isLoading}
                className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-md shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          
          {/* Footer branding */}
          <div className="bg-white pb-4 px-4 text-center">
            <p className="text-[10px] font-medium text-slate-300 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-primary/20" /> Powered by Minh Tuan AI
            </p>
          </div>
        </div>
      )}

      {/* AI Bubble Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-[22px] shadow-2xl flex items-center justify-center text-white transition-all duration-500 hover:scale-110 active:scale-95 relative group",
          isOpen ? "bg-slate-900" : "bg-primary"
        )}
      >
        {!isOpen && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white"></span>
          </div>
        )}
        {isOpen ? <X size={26} /> : <Bot size={32} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
