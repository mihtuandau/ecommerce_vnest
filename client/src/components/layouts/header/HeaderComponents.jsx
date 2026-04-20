import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaComments, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

export const AnimatedNavLink = ({ to, label, icon, className: cls, onClick, isActive }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group rounded-full ${
      isActive ? `font-semibold text-slate-800 bg-gray-100 shadow-sm` : `font-semibold ${cls || "text-slate-500 hover:text-slate-800 hover:bg-gray-50"}`
    }`}
  >
    {icon}
    <span>{label}</span>
    {!isActive && (
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-1/2" />
    )}
  </Link>
);

export const Badge = ({ count }) => count > 0 ? (
  <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-semibold border border-white">
    {count > 99 ? "99+" : count}
  </span>
) : null;

export const UserMenuItems = ({ user, logout, onClick }) => (
  <div className="flex flex-col">
    {['ADMIN', 'KHO', 'BAN_HANG'].includes(user?.role?.toUpperCase()) && (
      <>
        <Link
          to="/admin-dashboard"
          onClick={onClick}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-sm font-medium transition-all"
        >
          <FaUserShield size={16} /> <span>Trang Quản Trị</span>
        </Link>
        <div className="border-t border-gray-100" />
      </>
    )}
    <Link
      to="/profile"
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 hover:text-black text-black text-sm font-semibold transition-all"
    >
      <FaUserCircle size={18} className="text-gray-400" /> <span>Tài khoản</span>
    </Link>
    <Link
      to="/orders"
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 hover:text-black text-black text-sm font-semibold transition-all"
    >
      <FaClipboardList size={18} className="text-gray-400" /> <span>Đơn hàng của tôi</span>
    </Link>
    <Link
      to="/support"
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 hover:text-black text-black text-sm font-semibold transition-all"
    >
      <FaComments size={18} className="text-gray-400" /> <span>Hỗ trợ khách hàng</span>
    </Link>
    <div className="border-t border-gray-100 mt-1">
      <button
        onClick={() => { onClick(); logout(); }}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-semibold transition-all"
      >
        <FaSignOutAlt size={18} /> <span>Đăng xuất</span>
      </button>
    </div>
  </div>
);
