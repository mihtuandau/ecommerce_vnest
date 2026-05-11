import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../api";
import { ChatMessage } from "../types";

export const useChatMessages = (roomId: string | null) => {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", roomId],
    queryFn: () => chatApi.getMessages(roomId!),
    enabled: !!roomId,
  });
};
