import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const DesktopNav = ({ scrolled, categories, categoryDropdown, setCategoryDropdown }) => {
  return (
    <div className="hidden lg:block transition-all duration-300 relative z-40">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className={`flex items-center justify-center gap-8 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-3.5'
        }`}>
          <Link to="/" className={`transition-colors duration-300 font-medium ${
            scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
          }`}>
            Trang Chủ
          </Link>
          
          {/* Shop with Categories Dropdown */}
          <div className="relative group">
            <Link 
              to="/products" 
              className={`transition-colors duration-300 font-medium flex items-center gap-1 ${
                scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              Shop
              <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            
            {/* Categories Dropdown */}
            {categories && categories.length > 0 && (
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px] border border-gray-100">
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

          {/* More Dropdown - Chứa các link khác */}
          <div className="relative group">
            <button className={`transition-colors duration-300 font-medium flex items-center gap-1 ${
              scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
            }`}>
              Thêm
              <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
            </button>
            
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-lg shadow-lg py-2 min-w-[160px] border border-gray-100">
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Về Chúng Tôi
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Liên Hệ
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DesktopNav;
