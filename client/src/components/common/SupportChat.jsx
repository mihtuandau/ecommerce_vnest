import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, User } from 'lucide-react';
import chatSocketService from '../../services/chatSocketService';
import { useAuth } from '../../hooks/useAuth';

const SupportChat = ({ scrolled }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (user && isOpen) {
      initializeChat();
    }

    return () => {
      if (roomId) {
        chatSocketService.disconnect();
      }
    };
  }, [user, isOpen]);

  const initializeChat = async () => {
    try {
      console.log('🔵 Initializing support chat for user:', user.id);
      
      // Connect socket
      chatSocketService.connect();

      // Create room ID for user
      const userRoomId = `user-${user.id}`;
      setRoomId(userRoomId);
      console.log('🔵 Room ID:', userRoomId);

      // Join room and get message history
      const history = await chatSocketService.joinRoom(userRoomId, user.id);
      console.log('🔵 Message history:', history);
      setMessages(history || []);

      // Listen for new messages
      chatSocketService.onNewMessage((message) => {
        console.log('🔵 New message received:', message);
        setMessages((prev) => [...prev, message]);
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      });
      
      console.log('✅ Support chat initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('📤 Sending message:', { roomId, userId: user.id, message: messageText });
      const result = await chatSocketService.sendMessage(roomId, user.id, messageText);
      console.log('✅ Message sent:', result);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null; // Only show for logged in users

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 ${
          scrolled
            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            : 'text-white hover:bg-white/20'
        }`}
        aria-label="Support Chat"
      >
        <MessageSquare size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed top-20 right-4 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideDown">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <User size={18} />
              <div>
                <h3 className="text-sm font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-white/80">Trả lời trong vài phút</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-8">
                <User size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                      <span
                        className={`text-xs mt-1 block ${
                          isOwn ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-sm">Đang gửi...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 p-3 bg-white border-t border-gray-200 rounded-b-2xl"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading || !roomId}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!inputMessage.trim() || isLoading || !roomId}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SupportChat;
