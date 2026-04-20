import { useState, useEffect, useRef } from 'react';
import chatSocketService from '../../../services/chatSocketService';
import chatService from '../../../services/chatService';
import { useAuth } from '../../../hooks/useAuth';
import { notify } from '../../../utils/notification';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const AdminChatManagement = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const loadRooms = async () => {
    try {
      const data = await chatService.getRooms();
      setRooms(data || []);
    } catch (error) {
      notify.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadRooms();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    chatSocketService.connect();
    
    chatSocketService.onNewMessage((message) => {
      if (selectedRoom && message.roomId === selectedRoom) {
        setMessages((prev) => {
          const exists = prev.some(m => m.senderId === message.senderId && m.message === message.message && Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000);
          return exists ? prev : [...prev, message];
        });
      } else if (message.sender?.role === 'CUSTOMER') {
        notify.success(`${message.sender.name || 'Khách hàng'} đã gửi tin nhắn mới`);
        loadRooms();
      }
    });

    chatSocketService.onUserTyping((data) => setIsTyping(data.isTyping));

    return () => {
      chatSocketService.off('newMessage');
      chatSocketService.off('userTyping');
    };
  }, [selectedRoom, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTime = (value) => value ? new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  const getDisplayName = (room) => room?.user?.name || room?.lastMessage?.sender?.name || 'Khách hàng';
  const getDisplayEmail = (room) => room?.user?.email || room?.lastMessage?.sender?.email || '';

  const handleRoomSelect = async (roomId) => {
    if (!user) return;
    setSelectedRoom(roomId);
    const history = await chatSocketService.joinRoom(roomId, user.id);
    setMessages(history);
    chatSocketService.markAsRead(roomId, user.id);
    loadRooms();
    window.dispatchEvent(new CustomEvent('chatMessagesRead'));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;
    const msg = newMessage;
    setNewMessage('');
    const temp = { id: Date.now(), roomId: selectedRoom, senderId: user.id, message: msg, createdAt: new Date().toISOString(), sender: user };
    setMessages(prev => [...prev, temp]);

    try {
      await chatSocketService.sendMessage(selectedRoom, user.id, msg);
    } catch {
      notify.error('Lỗi khi gửi');
      setMessages(prev => prev.filter(m => m.id !== temp.id));
    }
  };

  const activeRoom = rooms.find(r => r.roomId === selectedRoom);

  return (
    <div className="h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_1fr]">
        <ChatSidebar 
          rooms={rooms}
          selectedRoom={selectedRoom}
          loading={loading}
          searchText={searchText}
          setSearchText={setSearchText}
          onRoomSelect={handleRoomSelect}
          getDisplayName={getDisplayName}
          getDisplayEmail={getDisplayEmail}
          formatTime={formatTime}
        />
        <ChatWindow 
          selectedRoom={selectedRoom}
          activeCustomerName={getDisplayName(activeRoom)}
          activeCustomerEmail={getDisplayEmail(activeRoom)}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isTyping={isTyping}
          handleSend={handleSend}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
};

export default AdminChatManagement;
