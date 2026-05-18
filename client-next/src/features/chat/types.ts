export interface ChatSender {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ChatMessage {
  id: number;
  roomId: string;
  senderId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: ChatSender;
}

export interface ChatRoom {
  roomId: string;
  unreadCount: number;
  lastMessage: ChatMessage;
  customer?: ChatSender;
}
