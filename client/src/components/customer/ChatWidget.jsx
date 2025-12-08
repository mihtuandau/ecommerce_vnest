import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import chatSocketService from '../../services/chatSocketService';
import toast from 'react-hot-toast';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const roomId = user ? `user-${user.id}` : 'guest';

  useEffect(() => {
    if (isOpen && user) {
      // Connect and join room
      chatSocketService.connect();
      chatSocketService.joinRoom(roomId, user.id).then((history) => {
        setMessages(history);
        scrollToBottom();
      });

      // Listen for new messages
      chatSocketService.onNewMessage((message) => {
        setMessages((prev) => {
          // Check if message already exists (avoid duplicates from optimistic update)
          const exists = prev.some(m => 
            (m.id === message.id) || // Same DB ID
            (m.senderId === message.senderId && 
             m.message === message.message && 
             Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000)
          );
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();
        
        // Play notification sound (optional)
        if (message.senderId !== user.id) {
          toast('💬 Tin nhắn mới từ admin', { icon: '💬' });
        }
      });

      // Listen for typing
      chatSocketService.onUserTyping((data) => {
        setTypingUser(data.userName);
        setIsTyping(data.isTyping);
        
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
          }, 3000);
        }
      });

      return () => {
        chatSocketService.off('newMessage');
        chatSocketService.off('userTyping');
      };
    }
  }, [isOpen, user, roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage;
    setNewMessage('');
    chatSocketService.sendTyping(roomId, user.name, false);

    // Optimistic update - add message to UI immediately
    const tempMessage = {
      id: Date.now(),
      roomId,
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
      await chatSocketService.sendMessage(roomId, user.id, messageText);
    } catch (error) {
      toast.error('Không thể gửi tin nhắn');
      // Remove temp message on error
      setMessages((prev) => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!user) return;

    // Send typing indicator
    chatSocketService.sendTyping(roomId, user.name, true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      chatSocketService.sendTyping(roomId, user.name, false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return null; // Only show for logged-in users
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 flex items-center justify-center"
        >
          <FaComments size={28} />
          {/* Unread badge (optional) */}
          {/* <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span> */}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FaComments className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-blue-100">Trả lời ngay lập tức</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <FaComments className="mx-auto mb-3 text-gray-300" size={48} />
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
                      className={`max-w-[75%] px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1 font-semibold">
                          {msg.sender.name || 'Admin'}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{typingUser || 'Admin'}</p>
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

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
