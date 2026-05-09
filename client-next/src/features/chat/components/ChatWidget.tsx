"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Bot,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { chatApi } from "../api";
import { productsApi } from "@/features/products/api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";

// ── GLOBAL CACHE FOR CHAT PRODUCTS ──
// Helps prevent 429 Too Many Requests by reusing data
const productCache: Record<number, any> = {};

// ── SUB-COMPONENT: PRODUCT CARD IN CHAT ──
const ChatProductCard = ({
  productId,
  salePrice,
}: {
  productId: number;
  salePrice?: number;
}) => {
  const [product, setProduct] = useState<any>(productCache[productId] || null);
  const [loading, setLoading] = useState(!productCache[productId]);

  useEffect(() => {
    // If already in cache, don't fetch again
    if (productCache[productId]) {
      setProduct(productCache[productId]);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await productsApi.getProduct(productId.toString());
        productCache[productId] = data; // Save to global cache
        setProduct(data);
      } catch (error: any) {
        // If 429, retry once after a delay
        if (error?.response?.status === 429) {
          setTimeout(fetchProduct, 2000);
          return;
        }
        console.error("Failed to fetch chat product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <div className="w-full h-20 bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
    );

  if (!product) return null;

  const normalizeImagePath = (path: any) => {
    if (typeof path !== "string" || !path) return "/placeholder.png";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const currentPrice = salePrice || product.basePrice;
  const originalPrice = product.originalPrice || (salePrice ? product.basePrice : null);
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group mt-2 relative z-10"
    >
      <div className="h-12 w-12 rounded-lg bg-slate-50/50 flex-shrink-0 overflow-hidden border border-slate-50 flex items-center justify-center relative">
        <Image
          src={normalizeImagePath(product.images?.[0]?.url || product.image)}
          alt={product.name}
          fill
          className="object-contain p-1.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-bold text-gray-900 tabular-nums">
            {formatCurrency(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[9px] text-gray-400 line-through tabular-nums">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-primary transition-colors" />
    </Link>
  );
};

// ── SUB-COMPONENT: DISCOUNT CARD IN CHAT ──
const ChatDiscountCard = ({ discount }: { discount: any }) => {
  const [copied, setCopied] = useState(false);
  const isFlash = discount.isFlashSale;

  const handleCopy = () => {
    navigator.clipboard.writeText(discount.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 border rounded-xl mt-2 relative overflow-hidden group transition-all",
        isFlash ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-lg text-white flex items-center justify-center flex-shrink-0 animate-pulse",
              isFlash ? "bg-red-500" : "bg-emerald-500"
            )}
          >
            <ShoppingCart size={14} />
          </div>
          <div>
            <h4
              className={cn(
                "text-[11px] font-bold uppercase tracking-wider",
                isFlash ? "text-red-700" : "text-emerald-700"
              )}
            >
              {isFlash && "⚡ "}
              {discount.code}
            </h4>
            <p
              className={cn(
                "text-[10px] font-medium",
                isFlash ? "text-red-600/70" : "text-emerald-600/70"
              )}
            >
              Giảm{" "}
              {discount.percentage
                ? `${discount.percentage}%`
                : formatCurrency(discount.fixedAmount)}
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
            copied
              ? isFlash
                ? "bg-red-500 text-white"
                : "bg-emerald-500 text-white"
              : isFlash
                ? "bg-white text-red-600 border border-red-200 hover:bg-red-500 hover:text-white"
                : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white"
          )}
        >
          {copied ? "Đã lưu!" : "Sao chép"}
        </button>
      </div>
      {discount.description && (
        <p className="text-[10px] text-slate-500 italic leading-tight border-t border-slate-100 pt-2 mt-1">
          {discount.description}
        </p>
      )}
      <div
        className={cn(
          "absolute -right-4 -bottom-4 h-12 w-12 rounded-full",
          isFlash ? "bg-red-500/5" : "bg-emerald-500/5"
        )}
      />
    </div>
  );
};

// ── MAIN COMPONENT ──
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const storage =
    typeof window !== "undefined" ? (user ? localStorage : sessionStorage) : null;
  const HISTORY_KEY = "ai_chat_history";
  const ID_KEY = "ai_conversation_id";

  const SUGGESTIONS = [
    "Tư vấn Laptop đồ họa",
    "Quà tặng dưới 5 triệu",
    "iPhone mới nhất",
    "Chính sách bảo hành",
  ];

  useEffect(() => {
    if (!storage) return;

    const savedId = storage.getItem(ID_KEY);
    const savedMessages = storage.getItem(HISTORY_KEY);

    if (savedId) setConversationId(savedId);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          role: "bot",
          content:
            "Xin chào! Tôi là Trợ lý ảo của Minh Tuấn Shop. Tôi có thể giúp gì cho bạn hôm nay?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, [user, storage]);

  useEffect(() => {
    if (!storage) return;
    if (messages.length > 0) {
      storage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
    if (conversationId) {
      storage.setItem(ID_KEY, conversationId);
    }
  }, [messages, conversationId, storage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setMessage("");

    const newUserMsg = {
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await chatApi.chatbotChat(userMsg, conversationId || undefined);

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const botMsg = {
        role: "bot",
        content: response.message,
        productIds: response.productIds || [],
        suggestions: response.suggestions || [],
        discounts: response.discounts || [],
        flashSalePrice: response.flashSalePrice || null,
        timestamp: response.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Xin lỗi, tôi đang gặp một chút sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé!",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-[400px] h-[620px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 font-sans">
          {/* AI Header */}
          <div className="bg-primary p-5 flex items-center justify-between text-white relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  Trợ lý Mua sắm AI
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/80 font-medium">
                    Đang trực tuyến
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Bạn có muốn xóa lịch sử và bắt đầu cuộc hội thoại mới không?"
                    )
                  ) {
                    setMessages([]);
                    setConversationId(null);
                    if (storage) {
                      storage.removeItem(HISTORY_KEY);
                      storage.removeItem(ID_KEY);
                    }
                  }
                }}
                className="h-8 w-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white"
                title="Xóa hội thoại"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-blue-700 opacity-50" />
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5 bg-slate-50/50 custom-scrollbar"
          >
            {messages.map((msg, index) => {
              const isBot = msg.role === "bot";
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2.5 w-full",
                    isBot ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {isBot && (
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-100 mt-1 shadow-sm">
                      <Bot size={16} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      isBot ? "items-start" : "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3.5 rounded-2xl text-[13px] leading-relaxed w-full break-words shadow-sm",
                        isBot
                          ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                          : "bg-primary text-white rounded-tr-none shadow-primary/20"
                      )}
                    >
                      {msg.content
                        .replace(/\[\s*(ids?|suggests?|code)\s*:[^\]]+\]/gi, "")
                        .trim()}

                      {/* Render Discount Cards */}
                      {isBot && msg.discounts && msg.discounts.length > 0 && (
                        <div className="mt-3 space-y-2 pt-3 border-t border-slate-50 w-full">
                          <p className="text-[10px] text-emerald-600 font-bold mb-2 uppercase tracking-widest">
                            Ưu đãi độc quyền:
                          </p>
                          {msg.discounts.map((d: any, i: number) => (
                            <ChatDiscountCard key={i} discount={d} />
                          ))}
                        </div>
                      )}

                      {/* Render Product Cards */}
                      {isBot && msg.productIds && msg.productIds.length > 0 && (
                        <div className="mt-3 space-y-2 pt-3 border-t border-slate-50 w-full">
                          <p className="text-[10px] text-primary/70 font-bold mb-2 uppercase tracking-widest">
                            Sản phẩm gợi ý:
                          </p>
                          {msg.productIds.map((id: number) => (
                            <ChatProductCard
                              key={id}
                              productId={id}
                              salePrice={msg.flashSalePrice?.[id]}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                  <Bot size={16} className="text-primary animate-pulse" />
                </div>
                <div className="bg-white border border-slate-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Suggestions */}
          {!isLoading && (
            <div className="px-5 py-3 flex flex-wrap gap-2 bg-white border-t border-slate-50">
              {(
                messages[messages.length - 1]?.suggestions ||
                (messages.length < 3 ? SUGGESTIONS : [])
              ).map((s: string, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    if (s.toLowerCase().includes("mới")) {
                      setMessages([]);
                      setConversationId(null);
                      if (storage) {
                        storage.removeItem(HISTORY_KEY);
                        storage.removeItem(ID_KEY);
                      }
                      return;
                    }
                    handleSendMessage(s);
                  }}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-primary hover:text-white border border-slate-100 rounded-full text-[11px] font-medium text-slate-600 transition-all duration-300 shadow-sm hover:shadow-primary/20"
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
            className="p-5 bg-white border-t border-slate-100 flex items-center gap-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hỏi trợ lý AI..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl text-sm py-2.5 px-4 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-30 shadow-lg shadow-primary/20 group"
            >
              <Send
                size={18}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-white transition-all duration-500 hover:scale-110 active:scale-95 relative group",
          isOpen ? "bg-primary rotate-90 shadow-primary/40" : "bg-primary shadow-primary/20"
        )}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </button>
    </div>
  );
}
