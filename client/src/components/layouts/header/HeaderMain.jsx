import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaChevronDown, FaUserCircle, FaClipboardList, FaUserShield, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useCartCount } from '../../../hooks/useCart';
import wishlistService from '../../../services/wishlistService';
import Button from '../../common/Button';
import Input from '../../common/Input';
import SupportChat from '../../common/SupportChat';
import { useState, useRef, useEffect } from 'react';

const HeaderMain = ({ scrolled, searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const cartCount = useCartCount();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load wishlist count
  const loadWishlistCount = () => {
    if (user) {
      wishlistService.getWishlist().then(data => {
        setWishlistCount(data?.length || 0);
      }).catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadWishlistCount();
  }, [user]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      loadWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  // Toggle dropdown on click
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Sử dụng 'click' thay vì 'mousedown' để Link có thời gian navigate
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className={`object-contain transition-all duration-300 ${
                scrolled ? 'w-16 h-16 sm:w-24 sm:h-24' : 'w-20 h-20 sm:w-30 sm:h-30'
              }`}
            />
            <span className={`font-bold transition-all duration-300 hidden sm:inline ${
              scrolled ? 'text-xl text-gray-900' : 'text-2xl text-white'
            }`}>
              MINH TUAN STORE
            </span>
            <span className={`font-bold transition-all duration-300 sm:hidden ${
              scrolled ? 'text-sm text-gray-900' : 'text-base text-white'
            }`}>
              MT STORE
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-full focus:outline-none transition-all duration-300 ${
                  scrolled 
                    ? 'border-gray-300 bg-white focus:border-gray-900' 
                    : 'border-white/30 bg-white/20 text-white placeholder:text-white/70 focus:border-white'
                }`}
              />
              <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                scrolled ? 'text-gray-400' : 'text-white/70'
              }`} size={20} />
              <Button
                variant={scrolled ? 'dark' : 'primary'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full ${
                  scrolled 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                Tìm
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Search Mobile */}
            <button 
              className={`lg:hidden transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FaSearch size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Support Chat - Hiển thị cho user đã đăng nhập */}
            <SupportChat scrolled={scrolled} />

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className={`relative transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
              title="Sản phẩm yêu thích"
            >
              <FaHeart size={20} className="sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className={`relative transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
              title="Giỏ hàng"
            >
              <FaShoppingBag size={20} className="sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 min-w-5 h-5 px-1.5 text-white text-xs rounded-full flex items-center justify-center transition-colors duration-300 ${
                  scrolled ? 'bg-red-600' : 'bg-red-500'
                }`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div 
                ref={dropdownRef}
                className="relative hidden sm:block"
              >
                <button 
                  onClick={toggleDropdown}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
                  }`}
                >
                  <FaUserCircle   size={20} className="sm:w-6 sm:h-6" />
                  <span className="hidden lg:inline font-medium">{user.name}</span>
                  <FaChevronDown 
                    size={16} 
                    className={`hidden lg:block transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Dropdown */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-5 w-48 z-50"
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <FaUserCircle size={18} />
                        Hồ sơ
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <FaClipboardList size={18} />
                        Đơn hàng
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link 
                          to="/admin-dashboard" 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <FaUserShield size={18} />
                          Quản trị viên
                        </Link>
                      )}
                      <div className="border-t border-gray-100">
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <FaSignOutAlt size={18} />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button
                  variant={scrolled ? 'dark' : 'primary'}
                  icon={FaUser}
                  className={`rounded-full text-sm sm:text-base px-3 sm:px-4 py-2 ${
                    scrolled 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden lg:inline">Đăng nhập</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <button 
              className={`lg:hidden transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMain;