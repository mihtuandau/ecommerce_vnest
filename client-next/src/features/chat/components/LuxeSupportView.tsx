"use client";

import React, { useState, useMemo, useRef } from "react";
import { useChatRooms } from "@/features/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatSession } from "@/features/chat/hooks/useChatSession";
import { SupportSidebar } from "./Support/SupportSidebar";
import { ChatMain } from "./Support/ChatMain";
import { CustomerInfo } from "./Support/CustomerInfo";

import { useUsers } from "@/features/users/hooks";

export default function LuxeSupportView() {
  const { user } = useAuthStore();

  const hasAccess = user?.role === "ADMIN" || user?.permissions?.includes("chat.support");

  if (!hasAccess) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC] font-sans p-6">
        <div className="max-w-md w-full text-center bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-2xl mx-auto border border-rose-250/50 shadow-inner">
            🛡️
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Không có quyền truy cập</h3>
            <p className="text-xs leading-relaxed text-slate-450 mt-2">
              Bạn không có quyền <span className="font-semibold text-rose-600">"chat.support"</span> để sử dụng tính năng này. Vui lòng liên hệ Quản trị viên để được phân quyền.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState<"customers" | "staff">("customers");
  const [isShortcutMenuOpen, setIsShortcutMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    orders: true,
    tags: false,
    notes: false,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch all staff members to enable direct chatting between staff
  const { data: usersResponse } = useUsers({ limit: 100 });
  const staffMembers = useMemo(() => {
    const rawList = Array.isArray(usersResponse) 
      ? usersResponse 
      : (usersResponse?.data || []);
    return rawList.filter((u: any) => 
      ["ADMIN", "KHO", "BAN_HANG"].includes(u.role?.toUpperCase()) && 
      u.id !== user?.id
    );
  }, [usersResponse, user]);
  
  // Custom Hook for chat logic
  const { 
    messages, 
    messagesLoading, 
    messagesEndRef, 
    sendMessage 
  } = useChatSession(selectedRoomId, refetchRooms);

  const selectedRoom = useMemo(() => {
    if (selectedRoomId?.startsWith("room_staff_")) {
      const otherStaffId = selectedRoomId.replace("room_staff_", "").split("_").find(id => String(id) !== String(user?.id));
      const staffObj = staffMembers.find((s: any) => String(s.id) === String(otherStaffId));
      return {
        roomId: selectedRoomId,
        customer: {
          id: staffObj?.id,
          name: staffObj?.name || "Nhân viên",
          role: staffObj?.role || "Staff",
          email: staffObj?.email,
        },
        isStaffChat: true,
      };
    }
    return rooms?.find(r => r.roomId === selectedRoomId);
  }, [rooms, selectedRoomId, staffMembers, user]);

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter(r => 
      (r.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText;
    sendMessage(textToSend);
    if (customText === undefined) {
      setInputText("");
    }
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        staffMembers={staffMembers}
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
        setIsShortcutMenuOpen={setIsShortcutMenuOpen}
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
