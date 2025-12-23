import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import HeaderMain from './header/HeaderMain';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';
import CartDrawer from '../cart/CartDrawer';
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
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

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
                <Link to="/" className="flex-shrink-0 pl-20">
                  <span 
                    className="text-2xl font-bold tracking-wider text-gray-900 transition-all duration-300" 
                  >
                    VALENTIA
                  </span>
                </Link>

                <nav className="flex items-center gap-6 " >
                  <Link to="/" className="text-gray-700 hover:text-gray-900 transition-all font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8">
                    Home
                  </Link>
           
                  <div className="relative group">
                    <Link 
                      to="/products" 
                      className="text-gray-700 hover:text-gray-900 transition-all font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8"
                    >
                      Shop
                    </Link>
                    
                    {categories && categories.length > 0 && (
                      <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-3 min-w-[240px] overflow-hidden">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <Link
                              to="/products"
                              className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
                            >
                              Tất cả sản phẩm
                            </Link>
                          </div>
                          <div className="py-1">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm font-medium"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                 <Link to="/promotions" className="text-gray-700 hover:text-gray-900 transition-all font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8">
                    Promotions
                  </Link>

                  <Link to="/about" className="text-gray-700 hover:text-gray-900 transition-all font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8">
                    About Us
                  </Link>

                  <Link to="/contact" className="text-gray-700 hover:text-gray-900 transition-all font-semibold text-lg uppercase hover:underline decoration-2 underline-offset-8">
                    Contact
                  </Link>
                </nav>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <FaSearch size={20} />
                  </button>

                  <Link to="/wishlist" className="relative">
                    <FaHeart size={20} className="text-gray-700 hover:text-gray-900" />
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
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-all hover:underline decoration-2 underline-offset-4"
                      >
                        <FaUser size={20} />
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
                    <Link to="/login" className="text-gray-700 hover:text-gray-900">
                      <FaUser size={20} />
                    </Link>
                  )}

                  <button onClick={() => setCartDrawerOpen(true)} className="relative text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                    <FaShoppingCart size={20} />
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all hover:underline decoration-2 underline-offset-4 ${
                  isHomePage && !scrolled
                    ? 'text-white hover:text-blue-200 hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FaGlobe size={18} />
                <span className="text-sm font-medium">
                  {selectedLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                </span>
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

              <button onClick={() => setCartDrawerOpen(true)} className={`relative transition-colors cursor-pointer ${
                isHomePage && !scrolled ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-gray-900'
              }`}>
                <FaShoppingCart size={20} />
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
      />

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
};

export default Header;