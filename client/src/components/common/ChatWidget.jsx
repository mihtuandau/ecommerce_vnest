import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import chatbotService from '../../services/chatbotService';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI. Bạn có thể hỏi tôi bất kỳ điều gì! 😊',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(text.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.message || 'Xin lỗi, tôi không thể trả lời lúc này.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const quickReplies = [
    'Tâm trạng bạn hôm nay thế nào?',
    'Kể cho tôi một câu chuyện vui',
    'Tư vấn phong cách thời trang',
    'Lời khuyên mua sắm online',
  ];

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Trợ lý AI</h3>
                <p className="text-xs text-white/80">Luôn sẵn sàng</p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <span className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-purple-600" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-gray-500 font-medium">Gợi ý câu hỏi:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="px-3 py-2 text-xs bg-white hover:bg-purple-50 text-purple-600 rounded-full border border-purple-200 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="flex items-center gap-2 p-4 bg-white border-t border-gray-200" onSubmit={handleSubmit}>
            <input
              type="text"
              className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
