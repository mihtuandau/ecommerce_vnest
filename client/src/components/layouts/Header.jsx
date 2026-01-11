import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import HeaderMain from './header/HeaderMain';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';
import CartDrawer from '../cart/CartDrawer';
import { 
  FaSearch, 
  FaShoppingBag , 
  FaUser, 
  FaHeart, 
  FaChevronDown, 
  FaUserCircle, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaGlobe,
  FaHeadset,
  FaUserShield
} from 'react-icons/fa';
import{CiHeart}  from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";

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
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const { user, logout, isAdmin } = useAuth();
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isHomePage && !scrolled ? 'bg-transparent' : 'bg-white shadow-lg'
    }`}>
      <div className="lg:hidden">
        <HeaderMain 
          scrolled={true}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>

      <div className="hidden lg:block">
        {scrolled ? (
          <div className="">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between py-5">
                <Link to="/" className="flex-shrink-0 pl-20 transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/logoMT.png" 
                    alt="Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </Link>

                <nav className="flex items-center gap-6 " >
                  <Link to="/" className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8 hover:translate-y-[-2px]">
                    Home
                  </Link>
           
                  <div className="relative group">
                    <Link 
                      to="/products" 
                      className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8 hover:translate-y-[-2px]"
                    >
                      Shop
                    </Link>
                    
                    {categories && categories.length > 0 && (
                      <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-3 min-w-[240px] overflow-hidden transform scale-95 group-hover:scale-100 transition-transform duration-300">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <Link
                              to="/products"
                              className="block font-semibold text-gray-900 hover:text-[#00a85a] transition-all duration-200 text-sm hover:translate-x-1"
                            >
                              Tất cả sản phẩm
                            </Link>
                          </div>
                          <div className="py-1">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-[#00a85a] transition-all duration-200 text-sm font-medium hover:translate-x-1"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                 <Link to="/promotions" className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8 hover:translate-y-[-2px]">
                    Promotions
                  </Link>

                  <Link to="/about" className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8 hover:translate-y-[-2px]">
                    About Us
                  </Link>

                  <Link to="/contact" className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8 hover:translate-y-[-2px]">
                    Contact
                  </Link>
                </nav>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
                    className="text-gray-700 hover:text-[#00a85a] transition-all duration-300 hover:scale-110 transform"
                  >
                    <FaSearch size={20} />
                  </button>

                  <Link to="/wishlist" className="relative transform hover:scale-110 transition-transform duration-300">
                    <FaHeart size={20} className="text-gray-700 hover:text-[#00a85a] transition-colors duration-300" />
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
                        className="flex items-center gap-1 text-gray-700 hover:text-[#00a85a] transition-all duration-300 hover:underline decoration-2 underline-offset-4 hover:scale-110 transform"
                      >
                        <FaUser size={20} />
                      </button>

                      {userDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-fadeIn origin-top-right transform transition-all duration-300 ease-out">
                          {isAdmin() && (
                            <Link to="/admin-dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-sm transition-all duration-200 hover:translate-x-1 font-semibold">
                              <FaUserShield size={16} />
                              <span>Quản lý</span>
                            </Link>
                          )}
                          {isAdmin() && <div className="border-t border-gray-100 my-1"></div>}
                          <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
                            <FaUserCircle size={16} />
                            <span>Tài khoản</span>
                          </Link>
                          <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
                            <FaClipboardList size={16} />
                            <span>Đơn hàng</span>
                          </Link>
                          <Link to="/support" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
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
                    <Link to="/login" className="text-gray-700 hover:text-[#00a85a]">
                      <FaUser size={20} />
                    </Link>
                  )}

                  <button onClick={() => setCartDrawerOpen(true)} className="relative text-gray-700 hover:text-[#00a85a] transition-all duration-300 cursor-pointer transform hover:scale-110">
                    <FaShoppingBag  size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Header - Not Scrolled */
          <>
            {/* Top Row: Language + Logo + Icons */}
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between py-5">
            {/* Left: Language Selector */}
            <div ref={languageDropdownRef} className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-300 hover:underline decoration-2 underline-offset-4 hover:scale-105 transform ${
                  isHomePage && !scrolled
                    ? 'text-white hover:text-green-200 hover:bg-white/10'
                    : 'text-gray-700 hover:text-[#00a85a] hover:bg-gray-50'
                }`}
              >
                <FaGlobe size={18} />
                <span className="text-sm font-medium">
                  {selectedLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                </span>
              </button>

              {languageDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] animate-fadeIn origin-top transform transition-all duration-300 ease-out">
                  <button
                    onClick={() => {
                      setSelectedLanguage('vi');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-sm transition-all duration-200 hover:translate-x-1 ${
                      selectedLanguage === 'vi' ? 'text-[#00a85a] bg-green-50' : 'text-gray-700'
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
                    className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-sm transition-all duration-200 hover:translate-x-1 ${
                      selectedLanguage === 'en' ? 'text-[#00a85a] bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Center: Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform duration-300">
              <img src="/textlogo.png" alt="Logo" className="h-12 w-auto object-contain" />
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
                className={`transition-all duration-300 hover:scale-110 transform ${
                  isHomePage && !scrolled ? 'text-white hover:text-green-200' : 'text-gray-700 hover:text-[#00a85a]'
                }`}
              >
                <FaSearch size={20} />
              </button>

              <Link to="/wishlist" className="relative transform hover:scale-110 transition-transform duration-300">
                <FaHeart size={20} className={
                  isHomePage && !scrolled ? 'text-white hover:text-green-200 transition-colors duration-300' : 'text-gray-700 hover:text-[#00a85a] transition-colors duration-300'
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
                    className={`flex items-center gap-1 transition-all duration-300 hover:scale-110 transform ${
                      isHomePage && !scrolled ? 'text-white hover:text-green-200' : 'text-gray-700 hover:text-[#00a85a]'
                    }`}
                  >
                    <FaUser size={20} />
                    <FaChevronDown size={10} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-fadeIn origin-top-right transform transition-all duration-300 ease-out">
                      {isAdmin() && (
                        <Link to="/admin-dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-sm transition-all duration-200 hover:translate-x-1 font-semibold">
                          <FaUserShield size={16} />
                          <span>Quản lý</span>
                        </Link>
                      )}
                      {isAdmin() && <div className="border-t border-gray-100 my-1"></div>}
                      <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
                        <FaUserCircle size={16} />
                        <span>Tài khoản</span>
                      </Link>
                      <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
                        <FaClipboardList size={16} />
                        <span>Đơn hàng</span>
                      </Link>
                      <Link to="/support" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 hover:text-[#00a85a] text-gray-700 text-sm transition-all duration-200 hover:translate-x-1">
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
                  isHomePage && !scrolled ? 'text-white hover:text-green-200' : 'text-gray-700 hover:text-[#00a85a]'
                }>
                  <FaUser size={20} />
                </Link>
              )}

              <button onClick={() => setCartDrawerOpen(true)} className={`relative transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                isHomePage && !scrolled ? 'text-white hover:text-green-200' : 'text-gray-700 hover:text-[#00a85a]'
              }`}>
                <FaShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

            <DesktopNav 
              scrolled={isHomePage ? scrolled : true}
              categories={categories}
              categoryDropdown={categoryDropdown}
              setCategoryDropdown={setCategoryDropdown}
              desktopSearchOpen={desktopSearchOpen}
              setDesktopSearchOpen={setDesktopSearchOpen}
              logoHidden={true}
            />
          </>
        )}
      </div>

      <MobileMenu 
        searchOpen={searchOpen}
        mobileMenuOpen={mobileMenuOpen}
        categories={categories}
        onClose={() => setMobileMenuOpen(false)}
      />

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
};

export default Header;