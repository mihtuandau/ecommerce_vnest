import { useState, useEffect } from 'react';
import chatService from '../services/chatService';
import chatSocketService from '../services/chatSocketService';

export const useChatNotifications = (user) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const rooms = await chatService.getRooms();
        const total = rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
        setUnreadCount(total);
      } catch (error) {}
    };

    loadUnreadCount();

    chatSocketService.connect();
    chatSocketService.onNewMessage((message) => {
      if (message.sender?.role === 'CUSTOMER') {
        setUnreadCount((prev) => prev + 1);
      }
    });

    const handleChatRead = () => {
      loadUnreadCount();
    };
    window.addEventListener('chatMessagesRead', handleChatRead);

    return () => {
      chatSocketService.off('newMessage');
      window.removeEventListener('chatMessagesRead', handleChatRead);
    };
  }, [user]);

  return unreadCount;
};






