import { 
  ArrowRight, 
  ShoppingBag, 
  Shirt, 
  Watch, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Home,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const FeaturedCategories = ({ categories = [], isLoading = false }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});

  // Icon mapping for categories
  const iconMap = {
    'Thời Trang': Shirt,
    'Đồng Hồ': Watch,
    'Điện Thoại': Smartphone,
    'Laptop': Laptop,
    'Phụ Kiện': Headphones,
    'Nhà Cửa': Home,
  };

  // Gradient combinations - Minimalist & Elegant
  const gradientColors = [
    { from: '#f8fafc', to: '#e2e8f0', text: 'text-gray-900', bg: 'bg-slate-50' }, // Slate
    { from: '#faf5ff', to: '#e9d5ff', text: 'text-gray-900', bg: 'bg-purple-50' }, // Soft Purple
    { from: '#f0fdf4', to: '#dcfce7', text: 'text-gray-900', bg: 'bg-green-50' }, // Mint
    { from: '#fef2f2', to: '#fecaca', text: 'text-gray-900', bg: 'bg-red-50' }, // Rose
    { from: '#fffbeb', to: '#fde68a', text: 'text-gray-900', bg: 'bg-amber-50' }, // Warm Sand
    { from: '#f0f9ff', to: '#bfdbfe', text: 'text-gray-900', bg: 'bg-blue-50' }, // Sky Blue
    { from: '#fefce8', to: '#fef08a', text: 'text-gray-900', bg: 'bg-yellow-50' }, // Soft Yellow
    { from: '#ecfeff', to: '#a5f3fc', text: 'text-gray-900', bg: 'bg-cyan-50' }, // Aqua
  ];

  // Badge icons
  const badgeIcons = {
    'Hot': TrendingUp,
    'New': Sparkles,
    'Sale': Zap,
    'Trend': Star
  };

  const tags = ['Hot', 'New', 'Sale', 'Trend'];

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const matchedKey = Object.keys(iconMap).find(key => 
      categoryName?.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? iconMap[matchedKey] : ShoppingBag;
  };

  // Fallback ảnh đẹp cho từng danh mục khi chưa có ảnh từ API
  const fallbackImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format',
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&auto=format',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&auto=format',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format',
  ];

  // Map categories từ API
  const displayCategories = categories.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image || fallbackImages[index % fallbackImages.length],
    productCount: cat._count?.products || 0,
    tag: tags[index % tags.length],
    desc: cat.description || 'Khám phá ngay',
    gradient: gradientColors[index % gradientColors.length]
  }));

  const handleImageLoad = (categoryId) => {
    setImageLoaded(prev => ({ ...prev, [categoryId]: true }));
  };

  // Scroll handlers
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      setScrollProgress((scrollLeft / (scrollWidth - clientWidth)) * 100);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [displayCategories]);

  // Loading Skeleton Component
  const CategorySkeleton = () => (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px]">
      <div className="relative bg-gray-200 h-[400px] animate-pulse overflow-hidden">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="absolute inset-0 bg-gray-300"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-400 to-transparent"></div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag size={64} className="text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có danh mục nào</h3>
      <p className="text-gray-500">Các danh mục sản phẩm sẽ được cập nhật sớm</p>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3 block">
            Hành trình khám phá
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-3">
            DANH MỤC NỔI BẬT
          </h2>
          <div className="w-12 h-px bg-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm theo cách kể chuyện độc đáo
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayCategories.length === 0 && <EmptyState />}

        {/* Timeline Container */}
        {!isLoading && displayCategories.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
                canScrollLeft 
                  ? 'opacity-100 hover:bg-gray-900 hover:text-white' 
                  : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
                canScrollRight 
                  ? 'opacity-100 hover:bg-gray-900 hover:text-white' 
                  : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>

            {/* Timeline Line */}
            <div className="absolute top-[200px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"></div>
            
            {/* Progress Bar */}
            <div 
              className="absolute top-[200px] left-0 h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 z-0 transition-all duration-300 rounded-full"
              style={{ width: `${scrollProgress}%` }}
            ></div>

            {/* Scrollable Timeline */}
            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-8 pt-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayCategories.map((category, index) => {
                const Icon = getCategoryIcon(category.name);
                const BadgeIcon = badgeIcons[category.tag];
                
                return (
                  <div
                    key={category.id}
                    className="flex-shrink-0 w-[300px] sm:w-[340px] snap-center"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeIn 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {/* Category Card with Image */}
                    <div
                      onClick={() => navigate(`/category/${category.id}`)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Xem danh mục ${category.name} với ${category.productCount} sản phẩm`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/category/${category.id}`);
                        }
                      }}
                      className="group relative w-full cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                    >
                      {/* Background Image */}
                      <div className="relative h-[420px]">
                          {!imageLoaded[category.id] && (
                            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                          )}
                          <img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                            onLoad={() => handleImageLoad(category.id)}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                              imageLoaded[category.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                          />

                          {/* Gradient Overlay */}
                          <div 
                            className="absolute inset-0 opacity-50 group-hover:opacity-60 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%)`
                            }}
                          ></div>

                          {/* Subtle Colored Accent */}
                          <div 
                            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${category.gradient.from} 0%, ${category.gradient.to} 100%)`
                            }}
                          ></div>

                          {/* Badge */}
                          <div className="absolute top-6 right-6 z-10">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md text-gray-700 text-xs font-semibold shadow-md transform group-hover:scale-105 transition-transform duration-300">
                              {BadgeIcon && <BadgeIcon size={14} strokeWidth={2} />}
                              {category.tag}
                            </span>
                          </div>

                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <div className="text-white text-center">
                              <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                                {category.name}
                              </h3>
                              <p className="text-white/90 text-sm mb-1 font-medium">
                                {category.desc}
                              </p>
                              <p className="text-white/80 text-xs mb-4">
                                {category.productCount}+ sản phẩm
                              </p>
                              
                              {/* CTA Button */}
                              <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30">
                                  Khám phá ngay
                                </span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <div className="flex gap-1">
                {displayCategories.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      Math.floor(scrollProgress / (100 / displayCategories.length)) === index
                        ? 'w-8 bg-gray-900'
                        : 'w-1 bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedCategories;
