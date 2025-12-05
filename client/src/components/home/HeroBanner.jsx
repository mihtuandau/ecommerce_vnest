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
    <div className="relative w-full h-[800px] overflow-hidden bg-gray-900">
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
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-slideUp">
              {currentBanner.title}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 drop-shadow-lg animate-slideUp animation-delay-200">
              {currentBanner.subtitle}
            </p>
            <div className="flex gap-4 animate-slideUp animation-delay-400">
              <Button
                onClick={() => window.location.href = currentBanner.ctaLink}
                className="px-8 py-4 text-lg font-semibold  rounded-full shadow-2xl hover:scale-105 transition-transform"
              >
                {currentBanner.cta}
              </Button>
              {currentBanner.type === 'video' && (
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  {videoMuted ? <Play size={20} /> : <Pause size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-8 right-8 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
};

export default HeroBanner;
