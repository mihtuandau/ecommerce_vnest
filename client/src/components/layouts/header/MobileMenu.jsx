import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import productService from '../../../services/productService';

const MobileMenu = ({ searchOpen, mobileMenuOpen, categories }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const searchRef = useRef(null);

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
              className="w-full pl-10 pr-4 py-2 border-2  rounded-full focus:border-gray-500 focus:outline-none item-center "
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
            <Link to="/" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              HOME
            </Link>
            
            {/* Shop with Categories */}
            <div className="space-y-1">
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all"
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
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="block py-2 pl-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              ABOUT US
            </Link>

            <Link to="/contact" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-semibold uppercase text-sm transition-all">
              CONTACT
            </Link>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {user ? (
              <>
                <Link to="/profile" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-medium text-sm transition-all">
                   Tài khoản
                </Link>
                <Link to="/orders" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-medium text-sm transition-all">
                   Đơn hàng
                </Link>
                <Link to="/support" className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 font-medium text-sm transition-all">
                   Hỗ trợ
                </Link>
              </>
            ) : (
              <Link to="/login" className="block py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 font-semibold text-sm text-center transition-all">
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
