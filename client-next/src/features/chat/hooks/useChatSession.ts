import { useState, useEffect, useRef, useCallback } from "react";
import { useChatMessages, useSocket } from "@/features/chat";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSession(selectedRoomId: string | null, refetchRooms: () => void) {
  const queryClient = useQueryClient();
  const { data: initialMessages, isLoading: messagesLoading } = useChatMessages(selectedRoomId);
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages with initial fetch
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Join room and Socket listeners
  useEffect(() => {
    if (socket && selectedRoomId) {
      socket.emit("joinRoom", { roomId: selectedRoomId });

      const handleNewMessage = (newMessage: any) => {
        if (newMessage.roomId === selectedRoomId) {
          setMessages(prev => [...prev, newMessage]);
          // Mark as read if we are in the room
          socket.emit("markAsRead", { roomId: selectedRoomId });
        }
        // Invalidate rooms list to update unread dots and last messages
        refetchRooms();
      };

      socket.on("newMessage", handleNewMessage);
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedRoomId, refetchRooms]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !selectedRoomId || !socket) return;
    
    socket.emit("sendMessage", {
      roomId: selectedRoomId,
      message: text.trim(),
    });
  }, [selectedRoomId, socket]);

  return {
    messages,
    setMessages,
    messagesLoading,
    messagesEndRef,
    sendMessage,
    isConnected,
    socket
  };
}
