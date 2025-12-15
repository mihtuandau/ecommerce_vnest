import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatSocketService from '../../../services/chatSocketService';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';

const SupportChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      initializeChat();
    }

    return () => {
      if (roomId) {
        chatSocketService.disconnect();
      }
    };
  }, [user]);

  const initializeChat = async () => {
    try {
      // Connect socket
      chatSocketService.connect();
      setIsConnected(true);

      // Create room ID for user
      const userRoomId = `user-${user.id}`;
      setRoomId(userRoomId);

      // Join room and get message history
      const history = await chatSocketService.joinRoom(userRoomId, user.id);
      setMessages(history || []);

      // Listen for new messages
      chatSocketService.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
      });
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      console.error('Failed to send message:', error);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để sử dụng dịch vụ hỗ trợ</p>
          <Button onClick={() => navigate('/login')} variant="primary">
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-6">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Hỗ Trợ Khách Hàng
                </h1>
                <p className="text-xs text-green-100 mt-0.5">
                  {isConnected ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></span>
                      Đang kết nối...
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white shadow-md h-[500px] flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-700 font-medium">Xin chào! 👋</p>
                <p className="text-gray-500 text-sm mt-1">
                  Chúng tôi có thể giúp gì cho bạn?
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isOwn = msg.senderId === user.id;
                return (
                  <div
                    key={index}
                    className={`flex items-end gap-2 animate-fadeIn ${
                      isOwn ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isOwn ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <User className={`w-4 h-4 ${isOwn ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className={`flex flex-col max-w-[75%]`}>
                      <div className={`px-3 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-green-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <span className={`text-xs mt-0.5 px-2 ${
                        isOwn ? 'text-right text-gray-400' : 'text-left text-gray-400'
                      }`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            {isLoading && (
              <div className="flex items-end gap-2 animate-fadeIn">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" />
                    <span className="text-sm">Đang nhập...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading || !isConnected}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || !isConnected}
                className="w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-green-50 rounded-b-xl shadow-md p-3 text-center border-t border-green-100">
          <p className="text-xs text-green-700">
            💬 Trả lời nhanh trong vài phút
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 197, 94, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SupportChatPage;
