import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(false);

  const defaultSlides = [
    {
      type: 'image',  
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
      title: 'Winter Fashion Sensations.',
      subtitle: 'Having plain clothing makes you look ordinary. We can assist you in choosing the right dresses with Foesta.',
      cta: 'Shop Now',
      ctaLink: '/products'
    },
  ];

  const bannerSlides = slides.length > 0 
    ? slides.map(banner => ({
        type: 'image',
        url: banner.image,
        title: banner.title || 'Winter Fashion Sensations.',
        subtitle: banner.subtitle || 'Having plain clothing makes you look ordinary.',
        cta: banner.buttonText || 'Shop Now',
        ctaLink: banner.link || '/products'
      }))
    : defaultSlides;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bannerSlides.length, isPlaying]);

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
    <div className="relative w-full h-[600px] lg:h-[800px] overflow-hidden bg-gray-100 -mt-[60px] select-none">
      {}
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
              muted={videoMuted}
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full lg:px-16">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black mb-4 sm:mb-6 leading-[1.1] animate-slideUp uppercase tracking-tighter">
              {currentBanner.title}
            </h1>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 animate-slideUp animation-delay-200 max-w-lg leading-relaxed font-medium">
              {currentBanner.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp animation-delay-400">
              <Link
                to={currentBanner.ctaLink}
                className="px-8 py-4 sm:px-10 sm:py-5 text-[11px] sm:text-xs font-semibold bg-white text-black border-none hover:bg-black hover:text-white transition-all duration-500 uppercase tracking-[0.2em] shadow-xl text-center"
              >
                {currentBanner.cta}
              </Link>
              {currentBanner.type === 'video' && (
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className="w-full sm:w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/30 transition-all rounded-full"
                >
                  {videoMuted ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/90 text-black hover:bg-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/90 text-black hover:bg-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {}
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

      {}
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





