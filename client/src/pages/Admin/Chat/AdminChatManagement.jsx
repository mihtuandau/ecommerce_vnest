import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane, FaUser, FaCircle } from 'react-icons/fa';
import chatSocketService from '../../../services/chatSocketService';
import chatService from '../../../services/chatService';
import { useAuth } from '../../../hooks/useAuth';
import { notify } from '../../../utils/notification';

const AdminChatManagement = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Load rooms function
  const loadRooms = async () => {
    try {
      const data = await chatService.getRooms();setRooms(data || []);
    } catch (error) {notify.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  // Load rooms on mount
  useEffect(() => {
    if (!user) return;
    loadRooms();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Connect socket
    chatSocketService.connect();

    // Listen for new messages
    chatSocketService.onNewMessage((message) => {
      if (selectedRoom && message.roomId === selectedRoom) {
        // Check if message already exists (from optimistic update)
        setMessages((prev) => {
          const exists = prev.some(m => 
            m.senderId === message.senderId && 
            m.message === message.message && 
            Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000
          );
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();
      } else {
        // Show toast for messages in other rooms from customer
        if (message.sender?.role === 'CUSTOMER') {
          const userName = message.sender.name || 'Khách hàng';
          notify.success(`💬 ${userName} đã gửi tin nhắn mới`, {
            duration: 4000,
            position: 'top-right',
          });
          // Reload rooms to update unread count
          loadRooms();
        }
      }
    });

    chatSocketService.onUserTyping((data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      chatSocketService.off('newMessage');
      chatSocketService.off('userTyping');
    };
  }, [selectedRoom, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomSelect = async (roomId) => {
    if (!user) return;
    setSelectedRoom(roomId);
    const history = await chatSocketService.joinRoom(roomId, user.id);
    setMessages(history);
    scrollToBottom();
    
    // Mark messages as read
    chatSocketService.markAsRead(roomId, user.id);
    
    // Reload rooms to update unread count in the list
    loadRooms();
    
    // Trigger event to update sidebar badge
    window.dispatchEvent(new CustomEvent('chatMessagesRead'));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const messageText = newMessage;
    setNewMessage('');

    // Optimistic update
    const tempMessage = {
      id: Date.now(),
      roomId: selectedRoom,
      senderId: user.id,
      message: messageText,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      await chatSocketService.sendMessage(selectedRoom, user.id, messageText);
    } catch (error) {
      notify.error('Không thể gửi tin nhắn');
      setMessages((prev) => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Rooms List */}
      <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#00a85a] text-white px-4 py-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaComments />
            Cuộc trò chuyện
          </h2>
        </div>
        
        <div className="overflow-y-auto h-full">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
              <p>Đang tải...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaComments className="mx-auto mb-3 text-gray-300" size={48} />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            rooms.map((room) => {
              // Get user info from last message sender (if customer sent the message)
              const userName = room.lastMessage?.sender?.role === 'CUSTOMER' 
                ? room.lastMessage.sender.name 
                : room.roomId.replace('user-', 'User #');
              const userEmail = room.lastMessage?.sender?.email;
              
              return (
                <button
                  key={room.roomId}
                  onClick={() => handleRoomSelect(room.roomId)}
                  className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                    selectedRoom === room.roomId ? 'bg-gray-50 border-l-4 border-l-gray-900' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <FaUser className="text-gray-900" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        {userEmail && <p className="text-xs text-gray-500">{userEmail}</p>}
                      </div>
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  {room.lastMessage && (
                    <p className="text-sm text-gray-600 line-clamp-1 ml-12">
                      {room.lastMessage.message}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="bg-[#00a85a] text-white px-4 py-3 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUser size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {messages[0]?.sender?.role === 'CUSTOMER' 
                      ? messages[0].sender.name 
                      : selectedRoom.replace('user-', 'User #')}
                  </h3>
                  <p className="text-xs text-gray-100 flex items-center gap-1">
                    <FaCircle size={8} className="text-green-400" />
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => {
                const isAdmin = msg.sender.role === 'ADMIN';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-lg ${
                        isAdmin
                          ? 'bg-[#00a85a] text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isAdmin ? 'text-gray-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t rounded-b-lg">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="2"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="px-4 bg-[#00a85a] text-white rounded-lg hover:bg-[#008f4d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaComments className="mx-auto mb-3 text-gray-300" size={64} />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatManagement;

