import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../api";
import { ChatRoom } from "../types";

export const useChatRooms = () => {
  return useQuery<ChatRoom[]>({
    queryKey: ["chat-rooms"],
    queryFn: chatApi.getRooms,
    refetchInterval: 10000,
  });
};
