import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
  FaClipboardList,
  FaSignOutAlt,
  FaUserShield,
  FaShoppingBag,
  FaComments,
  FaBolt,
  FaTags,
} from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import categoryService from "../../services/categoryService";
import wishlistService from "../../services/wishlistService";
import CartDrawer from "../cart/CartDrawer";
import { useAuth } from "../../hooks/useAuth";
import { useCartCount } from "../../hooks/useCart";
import { useHeaderSearch } from "../../hooks/useHeaderSearch";
import TopBar from "./TopBar";

// Animated NavLink Component
const AnimatedNavLink = ({
  to,
  label,
  icon,
  className: cls,
  onClick,
  isActive,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group rounded-full ${
      isActive
        ? `font-bold text-black bg-gray-100 shadow-sm`
        : `font-semibold ${cls || "text-gray-600 hover:text-black hover:bg-gray-50"}`
    }`}
  >
    {icon}
    <span>{label}</span>
    {/* Animated underline - only for non-active or subtle indicator */}
    {!isActive && (
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-1/2" />
    )}
  </Link>
);

const NAV_LINKS = [
  { to: "/", label: "Trang chủ" },
  { to: "/products", label: "Cửa hàng" },
  {
    to: "/flash-sale",
    label: "Flash Sale",
    icon: <FaBolt size={14} />,
    className: "text-black hover:text-gray-700",
  },
  {
    to: "/deals",
    label: "Ưu đãi",
    icon: <FaTags size={14} />,
    className: "text-black hover:text-gray-700",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const cartCount = useCartCount();

  const [categories, setCategories] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    isSearching,
  } = useHeaderSearch();

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const userDropdownRef = useRef(null);

  // ─── Data loading ───────────────────────────────────────────────────────────

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadWishlistCount = () => {
    if (user) {
      wishlistService
        .getWishlist()
        .then((data) => setWishlistCount(data?.length || 0))
        .catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadWishlistCount();
  }, [user]);

  useEffect(() => {
    const handler = () => loadWishlistCount();
    window.addEventListener("wishlistUpdated", handler);
    return () => window.removeEventListener("wishlistUpdated", handler);
  }, [user]);

  // ─── Scroll effect for header hide/show ──────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Show header when scroll to top
      if (scrollY < 100) {
        setShowHeader(true);
      }
      // Hide header when scroll down more than 50px
      else if (scrollY > lastScrollY + 50) {
        setShowHeader(false);
      }
      // Show header when scroll up
      else if (scrollY < lastScrollY - 30) {
        setShowHeader(true);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ─── Click outside ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target)
      )
        setShowSearchResults(false);
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      )
        setShowSearchResults(false);
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      )
        setUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  // ─── Shared sub-components ───────────────────────────────────────────────────

  const SearchResultsDropdown = () =>
    showSearchResults ? (
      <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[9999]">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-600">
              Đang tìm kiếm...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            {searchResults.map((product) => {
              const imageUrl = product.images?.[0]?.url || "/placeholder.png";
              const price =
                product.variants?.[0]?.price || product.basePrice || 0;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={handleSearchResultClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-100"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(price)}
                    </p>
                  </div>
                </Link>
              );
            })}
            <Link
              to={`/products?search=${encodeURIComponent(searchQuery)}`}
              onClick={() => setShowSearchResults(false)}
              className="block p-3 text-center text-sm text-black font-semibold hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              Xem tất cả kết quả →
            </Link>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <FaSearch className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">Không tìm thấy sản phẩm</p>
          </div>
        )}
      </div>
    ) : null;

  // Badge dùng chung cho cart & wishlist
  const Badge = ({ count }) =>
    count > 0 ? (
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold border border-white">
        {count > 99 ? "99+" : count}
      </span>
    ) : null;

  // User dropdown menu items dùng chung
  const UserMenuItems = ({ onClick }) => (
    <>
      {user.role?.toUpperCase() === "ADMIN" && (
        <>
          <Link
            to="/admin-dashboard"
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-sm font-medium transition-all hover:translate-x-1"
          >
            <FaUserShield size={16} /> <span>Quản lý</span>
          </Link>
          <div className="border-t border-gray-100" />
        </>
      )}
      <Link
        to="/profile"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-black text-gray-700 text-sm font-semibold transition-all hover:translate-x-1 uppercase tracking-wide"
      >
        <FaUserCircle size={16} /> <span>Tài khoản</span>
      </Link>
      <Link
        to="/orders"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-black text-gray-700 text-sm font-semibold transition-all hover:translate-x-1 uppercase tracking-wide"
      >
        <FaClipboardList size={16} /> <span>Đơn hàng</span>
      </Link>
      <Link
        to="/support"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 hover:text-black text-gray-700 text-sm font-semibold transition-all hover:translate-x-1 uppercase tracking-wide"
      >
        <FaComments size={16} /> <span>Hỗ trợ</span>
      </Link>
      <div className="border-t border-gray-100">
        <button
          onClick={() => {
            onClick();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-semibold transition-all uppercase tracking-wide"
        >
          <FaSignOutAlt size={16} /> <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  // Nav links dùng chung (desktop + mobile)
  const NavItems = ({ onClick, mobile = false, categories = [] }) => {
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const catDropdownRef = useRef(null);

    useEffect(() => {
      const handleClick = (e) => {
        if (
          catDropdownRef.current &&
          !catDropdownRef.current.contains(e.target)
        ) {
          setCatDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
      <div className="flex items-center gap-1 flex-nowrap">
        {NAV_LINKS.map(({ to, label, icon, className: cls }, index) => {
          const isActive = location.pathname === to;
          const isShop = label === "Cửa hàng";

          return (
            <div key={to} className="flex items-center gap-1 flex-nowrap">
              {mobile ? (
                <Link
                  to={to}
                  onClick={onClick}
                  className={`flex items-center gap-1.5 py-3 px-4 font-semibold text-sm uppercase tracking-wider rounded-lg transition-all ${isActive ? "text-black bg-gray-100" : `${cls || "text-gray-700"} hover:bg-gray-50 hover:text-black`}`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ) : (
                <AnimatedNavLink
                  to={to}
                  label={label}
                  icon={icon}
                  className={cls}
                  onClick={onClick}
                  isActive={isActive}
                />
              )}

              {/* Thêm nút Danh mục cạnh Cửa hàng */}
              {isShop && !mobile && (
                <div className="relative" ref={catDropdownRef}>
                  <button
                    onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group rounded-full font-semibold text-gray-600 hover:text-black hover:bg-gray-50 ${catDropdownOpen ? "bg-gray-100 text-black" : ""}`}
                  >
                    <span className="text-sm">DANH MỤC</span>
                    <FaChevronDown
                      size={7}
                      className={`transition-transform duration-300 ${catDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {catDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[9999] overflow-hidden p-2"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.id}`}
                              onClick={() => setCatDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-black text-xs font-bold rounded-lg transition-all uppercase tracking-wide"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-black" />
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-transform duration-300 ease-in-out ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TopBar */}
      <TopBar />

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="lg:hidden">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logoMT.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-5">
              <button
                className="text-gray-600 hover:text-black transition-colors p-1"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <FaSearch size={18} />
              </button>

              <Link
                to="/wishlist"
                className="relative text-gray-600 hover:text-black transition-colors p-1"
              >
                <FaHeart size={20} />
                <Badge count={wishlistCount} />
              </Link>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative text-gray-600 hover:text-black transition-colors p-1"
              >
                <FaShoppingBag size={18} />
                <Badge count={cartCount} />
              </button>

              <button
                className="text-gray-700 p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div
            className="p-3 bg-gray-50 border-b border-gray-100"
            ref={mobileSearchRef}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn muốn mua gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowSearchResults(true)
                }
                onKeyPress={handleSearchEnter}
                className="w-full px-5 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-sm bg-white"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full"
              >
                <FaSearch size={12} />
              </button>
              <SearchResultsDropdown />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Đồng bộ: dùng cùng nav links với desktop, thêm accordion cho categories */}
              {NAV_LINKS.slice(0, 2).map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
                >
                  {label}
                </Link>
              ))}

              {/* Flash Sale & Ưu đãi */}
              <Link
                to="/flash-sale"
                onClick={closeMobileMenu}
                className="flex items-center gap-1.5 py-3 px-4 text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
              >
                <FaBolt size={14} /> <span>Flash Sale</span>
              </Link>
              <Link
                to="/deals"
                onClick={closeMobileMenu}
                className="flex items-center gap-1.5 py-3 px-4 text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
              >
                <FaTags size={14} /> <span>Ưu đãi</span>
              </Link>

              {/* Categories accordion */}
              {categories.length > 0 && (
                <div>
                  <button
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
                  >
                    <span>Danh mục</span>
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileShopOpen && (
                    <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-4 mt-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.id}`}
                          onClick={closeMobileMenu}
                          className="block py-2 pl-4 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg text-sm font-semibold transition-all uppercase tracking-wide"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
              >
                Về chúng tôi
              </Link>

              <div className="border-t border-gray-200 my-2" />

              {/* Đồng bộ: user menu giống desktop */}
              {user ? (
                <UserMenuItems onClick={closeMobileMenu} />
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-sm transition-all uppercase tracking-wider"
                >
                  <FaUser size={16} /> <span>Đăng nhập</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="hidden lg:block bg-white/95 shadow-sm">
        {/* Top bar: Logo | Search | Actions */}
        <div className="max-w-7xl mx-auto px-4 py-3 border-b border-gray-50/50">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex-shrink-0 transition-transform hover:scale-105 duration-300"
            >
              <img
                src="/logoMT.png"
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Search - flexible width */}
            <div className="flex-1 max-w-2xl mx-auto" ref={desktopSearchRef}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Bạn đang tìm kiếm gì hôm nay?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchQuery.trim().length >= 2 && setShowSearchResults(true)
                  }
                  onKeyPress={handleSearchEnter}
                  className="w-full px-5 py-2.5 pr-12 border border-gray-200 rounded-full focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-sm bg-gray-50 group-hover:bg-white group-hover:border-gray-300"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-md active:scale-95"
                >
                  <FaSearch size={14} />
                </button>

                <SearchResultsDropdown />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex items-center group relative transition-colors"
                title="Yêu thích"
              >
                <div className="relative p-2 rounded-full group-hover:bg-red-50 transition-all">
                  <FaHeart
                    size={20}
                    className="text-gray-600 group-hover:text-red-500 transition-colors"
                  />
                  <Badge count={wishlistCount} />
                </div>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="flex items-center group relative transition-colors"
                title="Giỏ hàng"
              >
                <div className="relative p-2 rounded-full group-hover:bg-gray-100 transition-all">
                  <FaShoppingBag
                    size={20}
                    className="text-gray-600 group-hover:text-black transition-colors"
                  />
                  <Badge count={cartCount} />
                </div>
              </button>

              {/* User / Login */}
              <div ref={userDropdownRef} className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 group relative transition-colors"
                    >
                      <div className="relative p-2 rounded-full group-hover:bg-blue-50 transition-all">
                        <FaUser
                          size={20}
                          className="text-gray-600 group-hover:text-blue-600 transition-colors"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-black border-2 border-white rounded-full" />
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] text-gray-400 font-medium">
                          Xin chào,
                        </span>
                        <span className="text-[12px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate max-w-[72px]">
                          {user.name?.split(" ").slice(-1)[0] || "Bạn"}
                        </span>
                      </div>
                      <FaChevronDown
                        size={8}
                        className={`text-gray-400 group-hover:text-blue-600 transition-transform duration-300 ${userDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[9999] overflow-hidden"
                        >
                          <UserMenuItems
                            onClick={() => setUserDropdownOpen(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center group relative transition-colors"
                    title="Đăng nhập"
                  >
                    <div className="relative p-2 rounded-full group-hover:bg-gray-100 transition-all">
                      <FaUser
                        size={20}
                        className="text-gray-600 group-hover:text-black transition-colors"
                      />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-0 py-1.5 h-12">
            {/* Main navigation - Fixed (standing still) */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <NavItems categories={categories} />
            </div>

            {/* Separator - Fixed */}
            <div className="w-px h-5 bg-gray-200 mx-2 flex-shrink-0" />

            {/* Categories - Scrollable (Showing top 5) */}
            <div className="flex-1 overflow-hidden h-full ml-4">
              <div
                id="header-categories-scroll"
                className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden slim-scrollbar scroll-smooth pb-0.5"
              >
                <div className="flex items-center gap-1 flex-nowrap pr-4">
                  {categories.slice(0, 5).map((cat) => {
                    const isActive =
                      location.pathname === `/category/${cat.id}`;
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className={`px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group rounded-full flex-shrink-0 ${
                          isActive
                            ? `font-bold text-black bg-gray-100 shadow-sm`
                            : `font-semibold text-gray-700 hover:text-black hover:bg-gray-50`
                        }`}
                      >
                        {cat.name}
                        {!isActive && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-1/2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </header>
  );
};

export default Header;
