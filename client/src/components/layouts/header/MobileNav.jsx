import React from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaTags, FaChevronDown, FaUser } from 'react-icons/fa';
import { UserMenuItems } from './HeaderComponents';

export const MobileNav = ({ 
  user, 
  logout, 
  navLinks, 
  categories, 
  mobileShopOpen, 
  setMobileShopOpen, 
  closeMobileMenu 
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
        {navLinks.slice(0, 2).map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeMobileMenu}
            className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
          >
            {label}
          </Link>
        ))}

        <Link to="/flash-sale" onClick={closeMobileMenu} className="flex items-center gap-1.5 py-3 px-4 text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
          <FaBolt size={14} /> <span>Flash Sale</span>
        </Link>
        <Link to="/deals" onClick={closeMobileMenu} className="flex items-center gap-1.5 py-3 px-4 text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
          <FaTags size={14} /> <span>Ưu đãi</span>
        </Link>

        {categories.length > 0 && (
          <div>
            <button
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
            >
              <span>Danh mục</span>
              <FaChevronDown size={12} className={`transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileShopOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-4 mt-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={closeMobileMenu}
                    className="block py-2 pl-4 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-semibold transition-all uppercase tracking-wide"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <Link to="/about" onClick={closeMobileMenu} className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
          Về chúng tôi
        </Link>

        <div className="border-t border-gray-200 my-2" />

        {user ? (
          <UserMenuItems user={user} logout={logout} onClick={closeMobileMenu} />
        ) : (
          <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm transition-all uppercase tracking-wider">
            <FaUser size={16} /> <span>Đăng nhập</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
