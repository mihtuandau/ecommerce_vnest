import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingBag, FaUser, FaChevronDown } from 'react-icons/fa';
import { Badge, UserMenuItems } from './HeaderComponents';

export const UserActions = ({ 
  user, 
  logout, 
  wishlistCount, 
  cartCount, 
  setCartDrawerOpen, 
  userDropdownOpen, 
  setUserDropdownOpen, 
  userDropdownRef 
}) => {
  return (
    <div className="flex items-center gap-6 flex-shrink-0">
      <Link to="/wishlist" className="flex items-center group relative p-2 rounded-full hover:bg-red-50 transition-all" title="Yêu thích">
        <FaHeart size={20} className="text-gray-600 group-hover:text-red-500 transition-colors" />
        <Badge count={wishlistCount} />
      </Link>

      <button onClick={() => setCartDrawerOpen(true)} className="flex items-center group relative p-2 rounded-full hover:bg-gray-100 transition-all" title="Giỏ hàng">
        <FaShoppingBag size={20} className="text-gray-600 group-hover:text-black transition-colors" />
        <Badge count={cartCount} />
      </button>

      <div ref={userDropdownRef} className="relative">
        {user ? (
          <div className="relative">
            <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-1.5 group">
              <div className="relative p-2 rounded-full group-hover:bg-blue-50 transition-all">
                <FaUser size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-black border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400 font-medium">Xin chào,</span>
                <span className="text-[12px] font-semibold text-black group-hover:text-neutral-800 truncate max-w-[72px]">
                  {user.name?.split(" ").slice(-1)[0] || "Bạn"}
                </span>
              </div>
              <FaChevronDown size={8} className={`text-gray-400 group-hover:text-blue-600 transition-transform duration-300 ${userDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[9999] overflow-hidden"
                >
                  <UserMenuItems user={user} logout={logout} onClick={() => setUserDropdownOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 transition-all block">
            <FaUser size={20} className="text-gray-600 hover:text-black transition-colors" />
          </Link>
        )}
      </div>
    </div>
  );
};
