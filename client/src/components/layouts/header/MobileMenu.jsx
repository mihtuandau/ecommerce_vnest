import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaHeart, FaShoppingBag , FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useCartCount } from '../../../hooks/useCart';
import wishlistService from '../../../services/wishlistService';
import { useState, useEffect, useRef } from 'react';
import productService from '../../../services/productService';

const MobileMenu = ({ searchOpen, mobileMenuOpen, categories, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cartCount = useCartCount();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Load wishlist count
  useEffect(() => {
    if (user) {
      wishlistService.getWishlist().then(data => {
        setWishlistCount(data?.length || 0);
      }).catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  }, [user]);

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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Search */}
      {searchOpen && (
        <div className="lg:hidden p-4" ref={searchRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 border-2  rounded-full focus:border-[#00a85a] focus:outline-none item-center "
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[9999]">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full mx-auto"></div>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            <Link to="/" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              HOME
            </Link>
            
            {/* Shop with Categories */}
            <div className="space-y-1">
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all"
              >
                <span>SHOP</span>
                <FaChevronDown 
                  size={12} 
                  className={`transition-transform duration-200 ${
                    shopDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {shopDropdownOpen && categories && categories.length > 0 && (
                <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-4">
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="block py-2 pl-4 text-gray-600 hover:text-[#00a85a] hover:bg-green-50 rounded-lg text-sm font-medium transition-all"
                  >
                    Tất cả sản phẩm
                  </Link>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={onClose}
                      className="block py-2 pl-4 text-gray-600 hover:text-[#00a85a] hover:bg-green-50 rounded-lg text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/promotions" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              PROMOTIONS
            </Link>

            <Link to="/about" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              ABOUT US
            </Link>

            <Link to="/contact" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              CONTACT
            </Link>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Wishlist & Cart */}
            <Link to="/wishlist" onClick={onClose} className="flex items-center justify-between py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-medium text-sm transition-all">
              <div className="flex items-center gap-3">
                <FaHeart size={18} />
                <span>Yêu thích</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" onClick={onClose} className="flex items-center justify-between py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-medium text-sm transition-all">
              <div className="flex items-center gap-3">
                <FaShoppingBag  size={18} />
                <span>Giỏ hàng</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {user ? (
              <>
                {isAdmin() && (
                  <Link to="/admin-dashboard" onClick={onClose} className="flex items-center gap-3 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 font-semibold text-sm transition-all">
                    <FaUserShield size={18} />
                    <span>Quản lý</span>
                  </Link>
                )}
                {isAdmin() && <div className="border-t border-gray-100 my-2"></div>}
                <Link to="/profile" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-medium text-sm transition-all">
                  Tài khoản
                </Link>
                <Link to="/orders" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-medium text-sm transition-all">
                  Đơn hàng
                </Link>
                <Link to="/support" onClick={onClose} className="block py-3 text-gray-700 hover:text-[#00a85a] hover:bg-green-50 rounded-lg px-4 font-medium text-sm transition-all">
                  Hỗ trợ
                </Link>
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>
                
                <button 
                  onClick={() => {
                    logout();
                    onClose?.();
                  }} 
                  className="w-full flex items-center gap-3 py-3 text-red-600 hover:bg-red-50 rounded-lg px-4 font-medium text-sm transition-all"
                >
                  <FaSignOutAlt size={18} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={onClose} className="block py-3 text-white bg-[#00a85a] hover:bg-[#008f4d] rounded-lg px-4 font-semibold text-sm text-center transition-all">
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
