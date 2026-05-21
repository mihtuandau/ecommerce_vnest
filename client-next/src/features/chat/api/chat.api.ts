import { api } from "@/lib/http";

export const chatApi = {
  getRooms: async () => {
    const { data } = await api.get("/chat/rooms");
    return data;
  },
  getMessages: async (roomId: string) => {
    const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
    return data;
  },
  chatbotChat: async (message: string, conversationId?: string) => {
    const { data } = await api.post("/chatbot/chat", { message, conversationId });
    return data;
  },
  markAsRead: async (roomId: string) => {
    const { data } = await api.get(`/chat/rooms/${roomId}/mark-as-read`);
    return data;
  },
};
