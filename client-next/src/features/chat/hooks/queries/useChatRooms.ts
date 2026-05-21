import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import type { ChatRoom } from "@/features/chat/types";

export const useChatRooms = () => {
  return useQuery<ChatRoom[]>({
    queryKey: ["chat-rooms"],
    queryFn: chatApi.getRooms,
    refetchInterval: 10000,
  });
};
