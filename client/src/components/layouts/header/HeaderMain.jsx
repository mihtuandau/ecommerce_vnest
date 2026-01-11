import { Link, useNavigate } from 'react-router-dom';
import { FaSearch , FaUser, FaHeart, FaBars, FaTimes, FaChevronDown, FaUserCircle, FaClipboardList, FaUserShield, FaSignOutAlt, FaShoppingBag, FaComments } from 'react-icons/fa';
import { CiHeart } from "react-icons/ci";


import { useAuth } from '../../../hooks/useAuth';
import { useCartCount } from '../../../hooks/useCart';
import wishlistService from '../../../services/wishlistService';
import productService from '../../../services/productService';
import Button from '../../common/Button';
import Input from '../../common/Input';
import SupportChat from '../../common/SupportChat';
import { useState, useRef, useEffect } from 'react';

const HeaderMain = ({ scrolled, searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = useCartCount();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const searchRef = useRef(null);

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

  // Handle search
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await productService.getAll({ 
            search: searchQuery, 
            limit: 5,
            page: 1 
          });
          const products = response.data || [];
          setSearchResults(products);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setDesktopSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="transition-all duration-300 relative z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/textlogo.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex-1 flex justify-end lg:justify-center">
            {!desktopSearchOpen ? (
              <button
                onClick={() => setDesktopSearchOpen(true)}
                className="hidden lg:block text-gray-700 hover:text-gray-900 transition-colors duration-300"
              >
                <FaSearch size={20} />
              </button>
            ) : (
              <div className="hidden lg:flex max-w-md w-full mx-4" ref={searchRef}>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 bg-white focus:border-[#00a85a] rounded-full focus:outline-none transition-all duration-300"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300" size={20} />
                  <Button
                    variant="dark"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setShowSearchResults(false);
                        setDesktopSearchOpen(false);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#00a85a] text-white hover:bg-[#008f4d]"
                  >
                    Tìm
                  </Button>

                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="absolute top-full mt-2 w-[400px] bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[9999]">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin w-6 h-6 border-2 border-[#00a85a] border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-sm">Đang tìm kiếm...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((product) => {
                        const imageUrl = product.images?.[0]?.url || '/placeholder.png';
                        const price = product.variants?.[0]?.price || product.basePrice || 0;
                        
                        return (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors "
                          >
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded flex-shrink-0 bg-gray-100"
                              onError={(e) => {
                                e.target.src = '/placeholder.png';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600 font-semibold whitespace-nowrap">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(price)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <Link
                        to={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setShowSearchResults(false);
                        }}
                        className="block p-3 text-center text-sm text-gray-900 font-medium hover:bg-gray-50 border-t"
                      >
                        Xem tất cả kết quả
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <FaSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Không tìm thấy sản phẩm</p>
                    </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-9 flex-shrink-0">
            {/* Search Mobile */}
            <button 
              className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors duration-300"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FaSearch size={20} />
            </button>

            {/* Wishlist - hidden on mobile, visible on tablet/desktop */}
            <Link 
              to="/wishlist" 
              className="relative hidden sm:block text-gray-700 hover:text-gray-900 transition-colors duration-300 [&>svg]:fill-current"
              title="Sản phẩm yêu thích"
            >
              <CiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Icon */}
            {user ? (
              <div 
                ref={dropdownRef}
                className="relative hidden sm:block"
              >
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  <FaUser size={20} />
                  <FaChevronDown 
                    size={12} 
                    className={`hidden lg:block transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Dropdown */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 z-[9999]"
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors block"
                      >
                        <FaUserCircle size={18} className="pointer-events-none" />
                        <span className="pointer-events-none">Hồ sơ</span>
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors block"
                      >
                        <FaClipboardList size={18} className="pointer-events-none" />
                        <span className="pointer-events-none">Đơn hàng</span>
                      </Link>
                      <Link 
                        to="/support" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors block"
                      >
                        <FaComments size={18} className="pointer-events-none" />
                        <span className="pointer-events-none">Hỗ trợ</span>
                      </Link>
                      {user.role?.toUpperCase() === 'ADMIN' && (
                        <Link 
                          to="/admin-dashboard" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors block"
                        >
                          <FaUserShield size={18} className="pointer-events-none" />
                          <span className="pointer-events-none">Quản trị viên</span>
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
                          <FaSignOutAlt size={18} className="pointer-events-none" />
                          <span className="pointer-events-none">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-300">
                <FaUser size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-gray-900 transition-colors duration-300 [&>svg]:fill-current"
              title="Giỏ hàng"
            >
              <FaShoppingBag  size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button 
              className="lg:hidden text-gray-700"
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