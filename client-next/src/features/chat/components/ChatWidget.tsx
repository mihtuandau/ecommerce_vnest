"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, User, MessageSquare } from "lucide-react";
import { chatApi } from "../api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      content: "Xin chào! Tôi là trợ lý ảo của Minh Tuấn Shop. Tôi có thể giúp gì cho bạn?",
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
    
    // Add user message to UI
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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* AI Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Bot size={26} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">AI Minh Tuấn</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-blue-100 uppercase tracking-widest font-black">Sẵn sàng hỗ trợ</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => {
                   setIsOpen(false);
                   window.location.href = "/support";
                }}
                className="h-9 px-3 rounded-xl bg-white/20 hover:bg-white/30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/20"
              >
                <MessageSquare size={14} />
                Gặp nhân viên
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 custom-scrollbar"
          >
            {messages.map((msg, index) => {
              const isBot = msg.role === "bot";
              return (
                <div 
                  key={index} 
                  className={cn("flex items-end gap-2", isBot ? "flex-row" : "flex-row-reverse")}
                >
                  {isBot && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                      <Bot size={16} className="text-blue-600" />
                    </div>
                  )}
                  <div className={cn(
                    "flex flex-col max-w-[80%]",
                    isBot ? "items-start" : "items-end"
                  )}>
                    <div 
                      className={cn(
                        "p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                        isBot 
                          ? "bg-white text-slate-700 rounded-bl-none border border-slate-100" 
                          : "bg-blue-600 text-white rounded-br-none"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex items-end gap-2 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Bot size={16} className="text-blue-400" />
                </div>
                <div className="bg-white border border-slate-100 p-3.5 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bạn muốn hỏi gì AI..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!message.trim() || isLoading}
              className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          
          {/* Footer branding */}
          <div className="bg-white pb-3 px-4 text-center">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={10} /> Powered by Gemini AI
            </p>
          </div>
        </div>
      )}

      {/* AI Bubble Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-[24px] shadow-2xl flex items-center justify-center text-white transition-all duration-500 hover:scale-110 active:scale-95 relative group",
          isOpen ? "bg-slate-900" : "bg-gradient-to-br from-blue-600 to-indigo-700"
        )}
      >
        {!isOpen && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white"></span>
          </div>
        )}
        {isOpen ? <X size={26} /> : <Bot size={32} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
