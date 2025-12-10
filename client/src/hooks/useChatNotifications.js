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

    // Connect socket and listen for new messages
    chatSocketService.connect();
    chatSocketService.onNewMessage((message) => {
      // Only count messages from customers to admin
      if (message.sender?.role === 'CUSTOMER') {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Listen for custom event when admin reads messages
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
