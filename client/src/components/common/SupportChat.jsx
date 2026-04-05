import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, User } from 'lucide-react';
import chatSocketService from '../../services/chatSocketService';
import { useAuth } from '../../hooks/useAuth';

const SupportChat = ({ scrolled, isOpen: externalIsOpen, onClose }) => {
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState(null);

  // Determine if chat is open
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Initialize chat when opened
  useEffect(() => {
    if (user && isOpen) {
      initializeChat();
    }

    return () => {
      if (roomId) {
        chatSocketService.disconnect();
      }
    };
  }, [user, isOpen, roomId]);

  const initializeChat = async () => {
    try {
      // Connect socket
      chatSocketService.connect();

      // Create room ID for user
      const userRoomId = `user-${user.id}`;
      setRoomId(userRoomId);

      // Join room and get message history
      const history = await chatSocketService.joinRoom(userRoomId, user.id);
      setMessages(history || []);

      // Listen for new messages
      chatSocketService.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      });
    } catch (error) {
      console.error('Chat initialization error:', error);
    }
  };

  // Scroll to bottom when messages update
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
      await chatSocketService.sendMessage(roomId, user.id, messageText);
    } catch (error) {
      console.error('Send message error:', error);
      setInputMessage(messageText); // Restore message on error
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

  // Only show for logged in users
  if (!user) return null;

  // Chat content component
  const ChatContent = () => (
    <div className="fixedright-4 z-50 w-80 sm:w-96 h-[300px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideDown overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold">Hỗ trợ khách hàng</h3>
            <p className="text-xs text-gray-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online - Trả lời nhanh
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-white/10 rounded-full transition-all"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">Xin chào!</p>
            <p className="text-xs mt-1">Chúng tôi có thể giúp gì cho bạn?</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isOwn && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      isOwn
                        ? 'bg-[#00a85a] text-white rounded-br-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <span
                    className={`text-xs mt-1 px-2 ${
                      isOwn ? 'text-right text-gray-400' : 'text-left text-gray-500'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                {isOwn && (
                  <div className="w-8 h-8 bg-[#00a85a] rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User size={16} className="text-gray-600" />
            </div>
            <div className="bg-white border border-gray-200 text-gray-900 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-600" />
                <span className="text-sm">Đang nhập...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        className="flex items-center gap-2 p-4 bg-white border-t border-gray-200"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all"
          placeholder="Nhập tin nhắn..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading || !roomId}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 bg-[#00a85a] text-white rounded-full hover:bg-[#008f4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          disabled={!inputMessage.trim() || isLoading || !roomId}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>

      <style>{`
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(209, 213, 219, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(209, 213, 219, 0.3);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );

  // If controlled from parent
  if (externalIsOpen !== undefined) {
    return isOpen ? <ChatContent /> : null;
  }

  // Original behavior with toggle button
  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setInternalIsOpen(!internalIsOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 ${
          scrolled
            ? 'text-gray-600 hover:text-[#00a85a] hover:bg-gray-100'
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
      {internalIsOpen && <ChatContent />}
    </div>
  );
};

export default SupportChat;