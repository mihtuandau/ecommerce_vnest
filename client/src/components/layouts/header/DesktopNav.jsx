import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const DesktopNav = ({ scrolled, categories, categoryDropdown, setCategoryDropdown }) => {
  return (
    <div className="hidden lg:block transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className={`flex items-center justify-center gap-8 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-3.5'
        }`}>
          <Link to="/" className={`transition-colors duration-300 font-medium ${
            scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
          }`}>
            Trang Chủ
          </Link>
          
          {/* Categories Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setCategoryDropdown(true)}
            onMouseLeave={() => setCategoryDropdown(false)}
          >
            <button className={`flex items-center gap-1 transition-colors duration-300 font-medium ${
              scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
            }`}>
              Shop
              <FaChevronDown size={16} />
            </button>
            {categoryDropdown && categories && categories.length > 0 && (
              <div className="absolute top-full left-0 pt-2 w-56 z-[100]">
                <div className="bg-white rounded-lg shadow-xl py-2">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={`block px-4 py-2 hover:bg-gray-50 transition-colors ${
                      cat.highlight ? 'text-red-500 font-bold' : 'text-gray-700'
                    }`}
                    onClick={() => setCategoryDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/products?filter=sale" className={`transition-colors duration-300 font-bold ${
            scrolled ? 'text-gray-900 hover:text-gray-700' : 'text-white hover:text-gray-200'
          }`}>
            🔥 Sale
          </Link>
          <Link to="/about" className={`transition-colors duration-300 font-medium ${
            scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
          }`}>
            Về Chúng Tôi
          </Link>
          <Link to="/contact" className={`transition-colors duration-300 font-medium ${
            scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
          }`}>
            Liên Hệ
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default DesktopNav;
