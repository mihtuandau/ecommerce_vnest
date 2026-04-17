import React from 'react';
import { FaSearch, FaComments } from 'react-icons/fa';

const ChatSidebar = ({ rooms, selectedRoom, loading, searchText, setSearchText, onRoomSelect, getDisplayName, getDisplayEmail, formatTime }) => {
  const filteredRooms = rooms.filter((room) => {
    const text = searchText.trim().toLowerCase();
    if (!text) return true;
    const name = getDisplayName(room).toLowerCase();
    const email = getDisplayEmail(room).toLowerCase();
    const lastMessage = (room?.lastMessage?.message || '').toLowerCase();
    return name.includes(text) || email.includes(text) || lastMessage.includes(text);
  });

  return (
    <aside className="border-r border-slate-200 bg-[#fafafa]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-[28px] font-bold leading-none text-slate-900">Chat hỗ trợ</h2>
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
            const isSelected = selectedRoom === room.roomId;

            return (
              <button
                key={room.roomId}
                onClick={() => onRoomSelect(room.roomId)}
                className={`w-full border-b border-slate-100 px-3.5 py-3 text-left transition ${isSelected ? 'border-r-2 border-r-blue-500 bg-[#edf4ff]' : 'hover:bg-slate-50'}`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {(userName || 'K').charAt(0).toUpperCase()}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[17px] font-semibold leading-5 text-slate-900">{userName}</p>
                      {userEmail && <p className="truncate text-xs text-slate-500">{userEmail}</p>}
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
  );
};

export default ChatSidebar;
