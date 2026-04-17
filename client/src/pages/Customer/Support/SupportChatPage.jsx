import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Loader2, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chatSocketService from "../../../services/chatSocketService";
import { useAuth } from "../../../hooks/useAuth";
import Layout from "../../../components/layouts/Layout";


const SupportChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
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
      chatSocketService.connect();
      setIsConnected(true);

      const userRoomId = `user-${user.id}`;
      setRoomId(userRoomId);

      const history = await chatSocketService.joinRoom(userRoomId, user.id);
      setMessages(history || []);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      await chatSocketService.sendMessage(roomId, user.id, messageText);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
            Vui Lòng Đăng Nhập
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn cần đăng nhập để sử dụng dịch vụ hỗ trợ
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-black hover:bg-neutral-800 text-white transition-colors uppercase tracking-widest font-black text-xs"
          >
            Đăng Nhập
          </button>

        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-black border border-black p-6">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-lg font-normal text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Hỗ Trợ Khách Hàng
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    {isConnected ? (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        Đang kết nối...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-x border-gray-200 h-[500px] flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border border-gray-300 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-normal">Xin chào</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Chúng tôi có thể giúp gì cho bạn?
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === user.id;
                  return (
                    <div
                      key={index}
                      className={`flex items-end gap-3 animate-fadeIn ${
                        isOwn ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
                          isOwn ? "border-black bg-black" : "border-gray-200 bg-white"
                        }`}
                      >

                        <User
                          className={`w-4 h-4 ${
                            isOwn ? "text-white" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className={`flex flex-col max-w-[75%]`}>
                        <div
                          className={`px-4 py-3 ${
                            isOwn
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}

                        >
                          <p className="text-sm leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                        <span
                          className={`text-xs mt-1 px-1 ${
                            isOwn
                              ? "text-right text-gray-500"
                              : "text-left text-gray-500"
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
                <div className="flex items-end gap-3 animate-fadeIn">
                  <div className="w-8 h-8 border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />
                      <span className="text-sm">Đang nhập...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 bg-white focus:outline-none focus:border-gray-900 transition-colors"
                  disabled={isLoading || !isConnected}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim() || !isConnected}
                  className="w-12 h-12 bg-black text-white hover:bg-neutral-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>

              </form>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-200 border-t-0 p-4 text-center">
            <p className="text-xs text-gray-600">
              Trả lời nhanh trong vài phút
            </p>
          </div>
        </div>

        <style>{`
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
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default SupportChatPage;