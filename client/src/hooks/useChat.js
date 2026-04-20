import { useState, useEffect, useCallback } from 'react';
import chatSocketService from '../services/chatSocketService';

export const useChat = (user, isOpen) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    const rid = `user-${user.id}`;
    setRoomId(rid);
    chatSocketService.connect();
    chatSocketService.joinRoom(rid, user.id).then(h => setMessages(h || []));
    chatSocketService.onNewMessage(m => {
      setMessages(p => [...p, m]);
      if (!isOpen) setUnreadCount(c => c + 1);
    });
    return () => { if (rid) chatSocketService.disconnect(); };
  }, [user, isOpen]);

  useEffect(() => { if (isOpen) setUnreadCount(0); }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId || isLoading) return;
    const msg = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    try { await chatSocketService.sendMessage(roomId, user.id, msg); }
    catch { setInputMessage(msg); } finally { setIsLoading(false); }
  };

  return { messages, inputMessage, setInputMessage, sendMessage, isLoading, unreadCount };
};
