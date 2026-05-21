import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api";
import type { ChatMessage } from "@/features/chat/types";

export const useChatMessages = (roomId: string | null) => {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", roomId],
    queryFn: () => chatApi.getMessages(roomId!),
    enabled: !!roomId,
  });
};
