import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import HeaderMain from './header/HeaderMain';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Check if we're on homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {}
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHomePage
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className={`transition-all duration-300 ${scrolled ? 'scale-95' : 'scale-100'}`}>
        <HeaderMain 
          scrolled={scrolled || !isHomePage}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <DesktopNav 
          scrolled={scrolled || !isHomePage}
          categories={categories}
          categoryDropdown={categoryDropdown}
          setCategoryDropdown={setCategoryDropdown}
        />
      </div>

      <MobileMenu 
        searchOpen={searchOpen}
        mobileMenuOpen={mobileMenuOpen}
        categories={categories}
      />
    </header>
  );
};

export default Header;
