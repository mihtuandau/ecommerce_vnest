import { api } from "@/lib/axios";

export const chatApi = {
  getRooms: async () => {
    const { data } = await api.get("/chat/rooms");
    return data;
  },  
  getMessages: async (roomId: string) => {
    const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
    return data;
  },
};
