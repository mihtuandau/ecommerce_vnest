import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
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
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:border-green-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[9999]">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
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
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
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
                            <p className="text-sm text-green-600 font-semibold whitespace-nowrap">
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
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Trang Chủ
            </Link>
            <div className="space-y-1">
              <div className="font-medium text-gray-900 py-2">Danh Mục</div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`block py-2 pl-4 ${
                    cat.highlight ? 'text-red-500 font-bold' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Sản Phẩm
            </Link>
            <Link to="/products?filter=new" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Hàng Mới
            </Link>
            <Link to="/products?filter=sale" className="block py-2 text-red-500 hover:text-red-600 font-bold">
              🔥 Sale
            </Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Về Chúng Tôi
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Liên Hệ
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  📦 Đơn hàng của tôi
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  👤 Hồ sơ
                </Link>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-blue-600 font-bold">
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
