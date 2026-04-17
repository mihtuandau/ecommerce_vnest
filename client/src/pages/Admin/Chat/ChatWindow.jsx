import React from 'react';
import { FaCircle, FaPaperPlane, FaComments } from 'react-icons/fa';

const ChatWindow = ({ 
  selectedRoom, 
  activeCustomerName, 
  activeCustomerEmail, 
  messages, 
  newMessage, 
  setNewMessage, 
  isTyping, 
  handleSend, 
  formatTime, 
  messagesEndRef 
}) => {
  if (!selectedRoom) {
    return (
      <div className="grid flex-1 place-items-center text-slate-500 bg-[#f8fafc]">
        <div className="text-center">
          <FaComments className="mx-auto mb-3 text-slate-300" size={52} />
          <p className="text-base font-medium text-slate-700">Chọn một cuộc trò chuyện để bắt đầu</p>
          <p className="mt-1 text-sm text-slate-500">Danh sách hội thoại ở khung bên trái</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col bg-[#f8fafc]">
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
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatWindow;
