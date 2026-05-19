"use client";

import { useState, useEffect } from "react";
import { chatApi } from "../api";
import { useAuthStore } from "@/store/useAuthStore";

const HISTORY_KEY = "ai_chat_history";
const ID_KEY = "ai_conversation_id";

export function useChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const storage = typeof window !== "undefined" ? (user ? localStorage : sessionStorage) : null;

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
          content: "Xin chào! Tôi là Trợ lý ảo của LUXE. Tôi có thể giúp gì cho bạn hôm nay?",
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
          content: "Xin lỗi, tôi đang gặp một chút sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé!",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Bắt đầu hội thoại mới?")) {
      setMessages([]);
      setConversationId(null);
      if (storage) {
        storage.removeItem(HISTORY_KEY);
        storage.removeItem(ID_KEY);
      }
    }
  };

  return {
    isOpen,
    setIsOpen,
    message,
    setMessage,
    messages,
    isLoading,
    handleSendMessage,
    clearHistory
  };
}
