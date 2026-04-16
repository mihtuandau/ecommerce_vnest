import { useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane, FaCircle, FaSearch, FaBars, FaBell, FaChevronDown } from 'react-icons/fa';
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
  const [searchText, setSearchText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const loadRooms = async () => {
    try {
      const data = await chatService.getRooms();setRooms(data || []);
    } catch (error) {notify.error('Không thể tải danh sách chat');
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
        if (message.sender?.role === 'CUSTOMER') {
          const userName = message.sender.name || 'Khách hàng';
          notify.success(` ${userName} đã gửi tin nhắn mới`, {
            duration: 4000,
            position: 'top-right',
          });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (value) => {
    if (!value) return '--:--';
    return new Date(value).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayName = (room) => {
    return room?.user?.name || room?.lastMessage?.sender?.name || 'Khách hàng';
  };

  const getDisplayEmail = (room) => {
    return room?.user?.email || room?.lastMessage?.sender?.email || '';
  };

  const filteredRooms = rooms.filter((room) => {
    const text = searchText.trim().toLowerCase();
    if (!text) return true;
    const name = getDisplayName(room).toLowerCase();
    const email = getDisplayEmail(room).toLowerCase();
    const lastMessage = (room?.lastMessage?.message || '').toLowerCase();
    return name.includes(text) || email.includes(text) || lastMessage.includes(text);
  });

  const activeRoom = rooms.find((room) => room.roomId === selectedRoom);
  const activeCustomerName = activeRoom ? getDisplayName(activeRoom) : 'Khách hàng';
  const activeCustomerEmail = activeRoom ? getDisplayEmail(activeRoom) : '';
  const totalUnread = rooms.reduce((sum, room) => sum + Number(room?.unreadCount || 0), 0);

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('admin:toggle-sidebar'));
  };

  const handleRoomSelect = async (roomId) => {
    if (!user) return;
    setSelectedRoom(roomId);
    const history = await chatSocketService.joinRoom(roomId, user.id);
    setMessages(history);
    scrollToBottom();
    
    chatSocketService.markAsRead(roomId, user.id);
    
    loadRooms();
    
    window.dispatchEvent(new CustomEvent('chatMessagesRead'));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const messageText = newMessage;
    setNewMessage('');

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
    <div className="space-y-3">
      

      <div className="h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_1fr]">
          <aside className="border-r border-slate-200 bg-[#fafafa]">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-[28px] font-bold leading-none text-slate-900">Chat hỗ trợ</h2>
              {totalUnread > 0 && (
                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {totalUnread}
                </span>
              )}
            </div>

            <div className="border-b border-slate-200 p-3">
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Tìm cuộc trò chuyện..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                />
              </div>
            </div>

            <div className="h-[calc(100%-114px)] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-slate-500"></div>
                  <p className="text-sm">Đang tải...</p>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FaComments className="mx-auto mb-3 text-slate-300" size={40} />
                  <p className="text-sm">Không có cuộc trò chuyện phù hợp</p>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const userName = getDisplayName(room);
                  const userEmail = getDisplayEmail(room);
                  const selected = selectedRoom === room.roomId;

                  return (
                    <button
                      key={room.roomId}
                      onClick={() => handleRoomSelect(room.roomId)}
                      className={`w-full border-b border-slate-100 px-3.5 py-3 text-left transition ${selected ? 'border-r-2 border-r-blue-500 bg-[#edf4ff]' : 'hover:bg-slate-50'}`}
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="relative grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                            {(userName || 'K').charAt(0).toUpperCase()}
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[17px] font-semibold leading-5 text-slate-900">{userName}</p>
                            {userEmail && (
                              <p className="truncate text-xs text-slate-500">{userEmail}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{formatTime(room?.lastMessage?.createdAt)}</p>
                          {room.unreadCount > 0 && (
                            <span className="mt-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="line-clamp-1 pl-11 text-sm text-slate-600">
                        {room?.lastMessage?.message || 'Chưa có tin nhắn'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex h-full flex-col bg-[#f8fafc]">
            {selectedRoom ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative grid h-9 w-9 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {activeCustomerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{activeCustomerName}</h3>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        {activeCustomerEmail || 'Khách hàng'}
                        <span className="text-slate-300">·</span>
                        <FaCircle size={8} className="text-emerald-500" />
                        <span>Đang online</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isAdmin = msg?.sender?.role === 'ADMIN';
                      return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          {!isAdmin && (
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {(msg?.sender?.name || activeCustomerName || 'K').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isAdmin ? 'bg-blue-600 text-white rounded-br-md' : 'border border-slate-200 bg-white text-slate-800 rounded-bl-md'}`}>
                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                            <p className={`mt-1 text-[11px] ${isAdmin ? 'text-blue-100' : 'text-slate-400'}`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {activeCustomerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0.15s' }}></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0.3s' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-white p-3">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Nhập tin nhắn... (Enter để gửi)"
                      className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                      rows="1"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Gửi tin nhắn"
                    >
                      <FaPaperPlane size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center text-slate-500">
                <div className="text-center">
                  <FaComments className="mx-auto mb-3 text-slate-300" size={52} />
                  <p className="text-base font-medium text-slate-700">Chọn một cuộc trò chuyện để bắt đầu</p>
                  <p className="mt-1 text-sm text-slate-500">Danh sách hội thoại ở khung bên trái</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminChatManagement;

