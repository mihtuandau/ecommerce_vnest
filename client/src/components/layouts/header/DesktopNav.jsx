import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import productService from '../../../services/productService';

const DesktopNav = ({ scrolled, categories, categoryDropdown, setCategoryDropdown, logo, searchAction, actions, desktopSearchOpen, setDesktopSearchOpen, logoHidden }) => {
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

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setDesktopSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setDesktopSearchOpen]);

  return (
    <div className={`hidden lg:block relative z-40 transition-all duration-300 ${
      scrolled 
        ? '' 
        : ''
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center ${logoHidden ? 'justify-center' : 'justify-between'} py-4`}>
          {/* Logo - Left (hidden if logoHidden) */}
          {!logoHidden && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Menu - Center */}
          {!desktopSearchOpen && (
            <nav className="flex items-center gap-8">
            <Link to="/" className={`transition-colors duration-300 font-medium ${
              scrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-200'
            }`}>
              Home
            </Link>
          
          {/* Shop with Categories Dropdown */}
          <div className="relative group">
            <Link 
              to="/products" 
              className={`transition-colors duration-300 font-medium flex items-center gap-1 ${
                scrolled 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Shop
              <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            
            {/* Categories Dropdown */}
            {categories && categories.length > 0 && (
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px] ">
                  <Link
                    to="/products"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Tất cả sản phẩm
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/about" className={`transition-colors duration-300 font-medium ${
            scrolled 
              ? 'text-gray-700 hover:text-blue-600' 
              : 'text-white hover:text-blue-200'
          }`}>
            About Us
          </Link>

          <Link to="#" className={`transition-colors duration-300 font-medium ${
            scrolled 
              ? 'text-gray-700 hover:text-blue-600' 
              : 'text-white hover:text-blue-200'
          }`}>
            Blogs
          </Link>

          <Link to="/contact" className={`transition-colors duration-300 font-medium ${
            scrolled 
              ? 'text-gray-700 hover:text-blue-600' 
              : 'text-white hover:text-blue-200'
          }`}>
            Contact
          </Link>
        </nav>
          )}

          {/* Search Bar - Expanded */}
          {desktopSearchOpen && (
            <div className="flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                      setShowSearchResults(false);
                      setDesktopSearchOpen(false);
                    }
                  }}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 bg-white focus:border-gray-500 focus:outline-none rounded-full transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

                {/* Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-[9999]">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-500">
                        <div className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-xs">Đang tìm...</p>
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
                                setDesktopSearchOpen(false);
                              }}
                              className="flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                            >
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-100"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-gray-900 truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-green-600 font-semibold">
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
                            setDesktopSearchOpen(false);
                          }}
                          className="block p-2 text-center text-xs text-blue-600 font-medium hover:bg-gray-50 border-t"
                        >
                          Xem tất cả →
                        </Link>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        <FaSearch className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                        <p className="text-xs">Không tìm thấy</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Search & Actions - Right (hidden if logoHidden) */}
        {!logoHidden && (
          <div className="flex items-center gap-4 flex-shrink-0">
            {searchAction}
            {actions}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default DesktopNav;
