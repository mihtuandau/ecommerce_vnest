import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';

const SupportChat = ({ scrolled, isOpen: extOpen, onClose }) => {
  const { user } = useAuth();
  const [intOpen, setIntOpen] = useState(false);
  const isOpen = extOpen !== undefined ? extOpen : intOpen;
  const { messages, inputMessage, setInputMessage, sendMessage, isLoading, unreadCount } = useChat(user, isOpen);
  const endRef = useRef(null);

  useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [isOpen, messages]);

  if (!user) return null;

  const ChatWindow = () => (
    <div className="fixed sm:absolute bottom-16 right-0 z-50 w-80 sm:w-96 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between px-5 py-4 bg-black text-white">
        <div className="flex items-center gap-3"><MessageSquare size={18} /><div><h3 className="text-sm font-bold">Hỗ trợ khách hàng</h3><p className="text-[10px] text-green-400 flex items-center gap-1">● Online</p></div></div>
        <button onClick={() => onClose ? onClose() : setIntOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.senderId === user.id ? 'bg-black text-white rounded-br-none' : 'bg-white text-black border border-gray-100 rounded-bl-none shadow-sm'}`}>
              <p className="leading-relaxed">{msg.message}</p>
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 mx-auto" />}
        <div ref={endRef} />
      </div>
      <form className="p-4 bg-white border-t border-gray-50 flex gap-2" onSubmit={sendMessage}>
        <input type="text" className="flex-1 px-4 py-2 text-sm bg-gray-50 rounded-full outline-none focus:ring-1 focus:ring-black" placeholder="Nhập tin nhắn..." value={inputMessage} onChange={e => setInputMessage(e.target.value)} />
        <button type="submit" disabled={!inputMessage.trim() || isLoading} className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-30"><Send size={16} /></button>
      </form>
    </div>
  );

  return (
    <div className="relative">
      <button onClick={() => setIntOpen(!intOpen)} className={`relative p-2 transition-all ${scrolled ? 'text-black hover:scale-110' : 'text-white hover:bg-white/10 rounded-full'}`}>
        <MessageSquare size={20} />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
      </button>
      {isOpen && <ChatWindow />}
    </div>
  );
};

export default SupportChat;
