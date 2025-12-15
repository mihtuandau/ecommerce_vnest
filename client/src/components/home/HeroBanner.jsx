import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Button from '../common/Button';

const HeroBanner = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);

  // Default slides nếu không có data
  const defaultSlides = [
    {
      type: 'image',  
      url: 'https://example.com/default-banner1.jpg',
      title: 'Chào Mừng Đến Với Cửa Hàng Của Chúng Tôi',
      subtitle: 'Khám phá bộ sưu tập mới nhất ngay hôm nay',
      cta: 'Mua Ngay',
      ctaLink: '/products'
    },
  ];
 

  // Map banners từ API với format chuẩn
  const bannerSlides = slides.length > 0 
    ? slides.map(banner => {
        // Determine if it's a video based on video field being a real video URL
        const isVideo = banner.video && banner.video !== 'https://example.com/video.mp4' && banner.video.includes('.mp4');
        
        return {
          type: isVideo ? 'video' : 'image',
          url: isVideo ? banner.video : banner.image,
          title: banner.title || 'Banner',
          subtitle: banner.subtitle || '',
          cta: banner.buttonText || 'Xem Ngay',
          ctaLink: banner.link || '/products'
        };
      })
    : defaultSlides;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, bannerSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {bannerSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              src={slide.url}
              autoPlay
              loop
              muted={videoMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl lg:max-w-2xl animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl animate-slideUp leading-tight">
              {currentBanner.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-8 drop-shadow-lg animate-slideUp animation-delay-200">
              {currentBanner.subtitle}
            </p>
            <div className="flex gap-2 sm:gap-3 md:gap-4 animate-slideUp animation-delay-400">
              <Button
                onClick={() => window.location.href = currentBanner.ctaLink}
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-2xl hover:scale-105 transition-transform"
              >
                {currentBanner.cta}
              </Button>
              {currentBanner.type === 'video' && (
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  {videoMuted ? <Play size={16} className="sm:w-5 sm:h-5" /> : <Pause size={16} className="sm:w-5 sm:h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2 md:gap-3">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6 sm:w-8 bg-white'
                : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-30 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        {isPlaying ? <Pause size={14} className="sm:w-4 sm:h-4" /> : <Play size={14} className="sm:w-4 sm:h-4" />}
      </button>
    </div>
  );
};

export default HeroBanner;
