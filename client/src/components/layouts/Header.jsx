import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import HeaderMain from './header/HeaderMain';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaUser, 
  FaHeart, 
  FaChevronDown, 
  FaUserCircle, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaGlobe, 
  FaHeadset 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCartCount } from '../../hooks/useCart';
import wishlistService from '../../services/wishlistService';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('vi');

  const userDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const cartCount = useCartCount();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    loadCategories();
    loadWishlistCount();
  }, []);

  useEffect(() => {
    if (user) {
      loadWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadWishlistCount = () => {
    if (user) {
      wishlistService.getWishlist()
        .then(data => setWishlistCount(data?.length || 0))
        .catch(() => setWishlistCount(0));
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHomePage && !scrolled ? 'bg-transparent' : 'bg-white shadow-md'
    }`}>
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-gray-100">
        <HeaderMain 
          scrolled={true}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        {/* Top Row: Language + Logo + Icons */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left: Language Selector */}
            <div ref={languageDropdownRef} className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  isHomePage && !scrolled
                    ? 'text-white hover:text-blue-200 hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaGlobe size={18} />
                <span className="text-sm font-medium">
                  {selectedLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                </span>
                <FaChevronDown size={10} className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {languageDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999]">
                  <button
                    onClick={() => {
                      setSelectedLanguage('vi');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm ${
                      selectedLanguage === 'vi' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇻🇳</span>
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLanguage('en');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm ${
                      selectedLanguage === 'en' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Center: Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <span 
                className={`text-2xl font-bold tracking-wider transition-colors ${
                  isHomePage && !scrolled ? 'text-white' : 'text-gray-900'
                }`} 
                style={{ fontFamily: 'serif' }}
              >
                VALENTIA
              </span>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
                className={`transition-colors ${
                  isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FaSearch size={20} />
              </button>

              <Link to="/wishlist" className="relative">
                <FaHeart size={20} className={
                  isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
                } />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div ref={userDropdownRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-1 transition-colors ${
                      isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <FaUser size={20} />
                    <FaChevronDown size={10} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                      <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                        <FaUserCircle size={16} />
                        <span>Tài khoản</span>
                      </Link>
                      <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                        <FaClipboardList size={16} />
                        <span>Đơn hàng</span>
                      </Link>
                      <Link to="/support" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm">
                        <FaHeadset size={16} />
                        <span>Hỗ trợ</span>
                      </Link>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm"
                        >
                          <FaSignOutAlt size={16} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={
                  isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
                }>
                  <FaUser size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative">
                <FaShoppingCart size={20} className={
                  isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
                } />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Menu Below */}
        <DesktopNav 
          scrolled={isHomePage ? scrolled : true}
          categories={categories}
          categoryDropdown={categoryDropdown}
          setCategoryDropdown={setCategoryDropdown}
          desktopSearchOpen={desktopSearchOpen}
          setDesktopSearchOpen={setDesktopSearchOpen}
          logoHidden={true}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        searchOpen={searchOpen}
        mobileMenuOpen={mobileMenuOpen}
        categories={categories}
      />
    </header>
  );
};

export default Header;