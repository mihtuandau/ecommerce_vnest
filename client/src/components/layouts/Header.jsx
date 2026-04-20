import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaHeart, FaBars, FaTimes, FaShoppingBag, FaBolt, FaTags } from "react-icons/fa";
import categoryService from "../../services/categoryService";
import wishlistService from "../../services/wishlistService";
import CartDrawer from "../cart/CartDrawer";
import { useAuth } from "../../hooks/useAuth";
import { useCartCount } from "../../hooks/useCart";
import { useHeaderSearch } from "../../hooks/useHeaderSearch";
import TopBar from "./TopBar";
import { Badge } from "./header/HeaderComponents";
import { SearchInput, SearchResultsDropdown } from "./header/HeaderSearch";
import { UserActions } from "./header/UserActions";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";

const NAV_LINKS = [
  { to: "/", label: "Trang chủ" },
  { to: "/products", label: "Cửa hàng" },
  { to: "/flash-sale", label: "Flash Sale", icon: <FaBolt size={14} />, className: "text-black hover:text-gray-700" },
  { to: "/deals", label: "Ưu đãi", icon: <FaTags size={14} />, className: "text-black hover:text-gray-700" },
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

  const { searchQuery, setSearchQuery, searchResults, showSearchResults, setShowSearchResults, isSearching } = useHeaderSearch();
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    categoryService.getAll().then(data => setCategories(data || []));
  }, []);

  const loadWishlistCount = () => {
    if (user) wishlistService.getWishlist().then(d => setWishlistCount(d?.length || 0)).catch(() => setWishlistCount(0));
    else setWishlistCount(0);
  };
  useEffect(() => { loadWishlistCount(); }, [user]);
  useEffect(() => {
    const h = () => loadWishlistCount();
    window.addEventListener("wishlistUpdated", h);
    return () => window.removeEventListener("wishlistUpdated", h);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 100) setShowHeader(true);
      else if (y > lastScrollY + 50) setShowHeader(false);
      else if (y < lastScrollY - 30) setShowHeader(true);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClick = (e) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) setShowSearchResults(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setShowSearchResults(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setShowSearchResults]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery)}`); setShowSearchResults(false); }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      <TopBar />

      {/* Mobile Bar */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0 animate-fadeIn">
            <img src="/logoMT.png" alt="Logo" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}><FaSearch size={18} /></button>
            <Link to="/wishlist" className="relative text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-colors"><FaHeart size={18} /><Badge count={wishlistCount} /></Link>
            <button onClick={() => setCartDrawerOpen(true)} className="relative text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-colors"><FaShoppingBag size={18} /><Badge count={cartCount} /></button>
            <button className="text-gray-900 p-1.5 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}</button>
          </div>
        </div>
        {mobileSearchOpen && (
          <div className="p-3 bg-gray-50 border-b border-gray-100" ref={mobileSearchRef}>
            <SearchInput 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleSearchSubmit={handleSearchSubmit} 
              setShowSearchResults={setShowSearchResults} 
              handleSearchEnter={(e) => e.key === "Enter" && handleSearchSubmit()} 
              placeholder="Bạn muốn mua gì?"
            >
              <SearchResultsDropdown 
                showSearchResults={showSearchResults} 
                isSearching={isSearching} 
                searchResults={searchResults} 
                searchQuery={searchQuery} 
                handleSearchResultClick={() => { setShowSearchResults(false); setSearchQuery(""); }} 
                setShowSearchResults={setShowSearchResults} 
              />
            </SearchInput>
          </div>
        )}
        {mobileMenuOpen && <MobileNav user={user} logout={logout} navLinks={NAV_LINKS} categories={categories} mobileShopOpen={mobileShopOpen} setMobileShopOpen={setMobileShopOpen} closeMobileMenu={() => setMobileMenuOpen(false)} />}
      </div>

      {/* Desktop Bar */}
      <div className="hidden lg:block bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 border-b border-gray-50/50 flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105 duration-300"><img src="/logoMT.png" alt="Logo" className="h-12 w-auto object-contain" /></Link>
          <div className="flex-1 max-w-2xl mx-auto" ref={desktopSearchRef}>
            <SearchInput 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleSearchSubmit={handleSearchSubmit} 
              setShowSearchResults={setShowSearchResults} 
              handleSearchEnter={(e) => e.key === "Enter" && handleSearchSubmit()} 
            >
              <SearchResultsDropdown 
                showSearchResults={showSearchResults} 
                isSearching={isSearching} 
                searchResults={searchResults} 
                searchQuery={searchQuery} 
                handleSearchResultClick={() => { setShowSearchResults(false); setSearchQuery(""); }} 
                setShowSearchResults={setShowSearchResults} 
              />
            </SearchInput>
          </div>
          <UserActions user={user} logout={logout} wishlistCount={wishlistCount} cartCount={cartCount} setCartDrawerOpen={setCartDrawerOpen} userDropdownOpen={userDropdownOpen} setUserDropdownOpen={setUserDropdownOpen} userDropdownRef={userDropdownRef} />
        </div>
        <div className="max-w-7xl mx-auto px-6"><DesktopNav navLinks={NAV_LINKS} categories={categories} /></div>
      </div>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
};

export default Header;
