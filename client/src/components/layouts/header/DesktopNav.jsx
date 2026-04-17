import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { AnimatedNavLink } from './HeaderComponents';

export const DesktopNav = ({ navLinks, categories }) => {
  const location = useLocation();
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const catDropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="flex items-center h-12 w-full gap-4">
      <div className="flex items-center gap-1 flex-shrink-0">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          const isShop = link.label === "Cửa hàng";

          return (
            <div key={link.to} className="flex items-center gap-1">
              <AnimatedNavLink
                to={link.to}
                label={link.label}
                icon={link.icon}
                className={link.className}
                isActive={isActive}
              />

              {isShop && (
                <div className="relative" ref={catDropdownRef}>
                  <button
                    onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm uppercase tracking-wider transition-all duration-300 rounded-full font-semibold text-gray-600 hover:text-black hover:bg-gray-50 ${catDropdownOpen ? "bg-gray-100 text-black" : ""}`}
                  >
                    <span>DANH MỤC</span>
                    <FaChevronDown size={7} className={`transition-transform duration-300 ${catDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {catDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[9999] p-2"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.id}`}
                              onClick={() => setCatDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-black text-xs font-bold rounded-lg transition-all uppercase tracking-wide"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />

      {/* Categories Scrollable */}
      <div className="flex-1 overflow-hidden h-full">
        <div className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden slim-scrollbar scroll-smooth">
          <div className="flex items-center gap-1 flex-nowrap pr-4">
            {categories.slice(0, 5).map((cat) => {
              const isActive = location.pathname === `/category/${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group rounded-full ${
                    isActive ? "font-bold text-black bg-gray-100 shadow-sm" : "font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                  {!isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-1/2" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
