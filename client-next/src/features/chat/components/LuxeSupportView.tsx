"use client";

import React, { useState, useMemo, useRef } from "react";
import { useChatRooms } from "@/features/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatSession } from "@/features/chat/hooks/useChatSession";
import { SupportSidebar } from "./Support/SupportSidebar";
import { ChatMain } from "./Support/ChatMain";
import { CustomerInfo } from "./Support/CustomerInfo";

export default function LuxeSupportView() {
  const { user } = useAuthStore();
  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isShortcutMenuOpen, setIsShortcutMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    orders: true,
    tags: false,
    notes: false,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Custom Hook for chat logic
  const { 
    messages, 
    messagesLoading, 
    messagesEndRef, 
    sendMessage 
  } = useChatSession(selectedRoomId, refetchRooms);

  const selectedRoom = useMemo(() => 
    rooms?.find(r => r.roomId === selectedRoomId), 
    [rooms, selectedRoomId]
  );

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter(r => 
      (r.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  const handleSendMessage = () => {
    sendMessage(inputText);
    setInputText("");
    setIsShortcutMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (val: string) => {
    setInputText(val);
    setIsShortcutMenuOpen(val.startsWith("/"));
  };

  const useShortcut = (text: string) => {
    setInputText(text);
    setIsShortcutMenuOpen(false);
    inputRef.current?.focus();
  };

  const shortcuts = [
    { key: "/chào", text: "Xin chào! Tôi là nhân viên hỗ trợ LUXE. Tôi có thể giúp gì cho bạn hôm nay?", label: "Lời chào hỏi" },
    { key: "/cảmơn", text: "Cảm ơn bạn đã liên hệ với LUXE! Rất vui được hỗ trợ bạn. Vấn đề của bạn đã được ghi nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.", label: "Lời cảm ơn" },
    { key: "/vậnchuyển", text: "Đơn hàng của bạn hiện đang được vận chuyển bởi Giao Hàng Nhanh. Dự kiến giao trong 1-2 ngày làm việc.", label: "Thông tin vận chuyển" },
    { key: "/đổitrả", text: "Chính sách đổi trả của LUXE: Trong vòng 30 ngày kể từ ngày nhận hàng. Sản phẩm còn nguyên tem, chưa qua sử dụng.", label: "Chính sách đổi trả" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans">
      <SupportSidebar 
        rooms={filteredRooms}
        roomsLoading={roomsLoading}
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ChatMain 
        selectedRoomId={selectedRoomId}
        selectedRoom={selectedRoom}
        messages={messages}
        messagesLoading={messagesLoading}
        user={user}
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        isShortcutMenuOpen={isShortcutMenuOpen}
        shortcuts={shortcuts}
        onUseShortcut={useShortcut}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
        onHandleInput={handleInput}
      />

      <CustomerInfo 
        selectedRoomId={selectedRoomId}
        selectedRoom={selectedRoom}
        openSections={openSections}
        onToggleSection={(s) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }))}
      />
    </div>
  );
}
