import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TopBanner = ({ scrolled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const announcements = [
    { text: "Welcome to our store", link: "#", linkText: "Learn more" },
    { text: "Free shipping on orders over $50", link: "/products", linkText: "Shop now" },
    { text: "New arrivals every week", link: "/products", linkText: "Discover" },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className={`transition-all duration-300 py-2 relative ${
      scrolled 
        ? 'bg-gray-900 text-white' 
        : 'bg-transparent text-white'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="hover:text-gray-300 transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="text-sm text-center">
          <span>{currentAnnouncement.text}</span>
          {currentAnnouncement.link && (
            <>
              {' '}
              <a
                href={currentAnnouncement.link}
                className="underline hover:text-gray-300 font-medium"
              >
                {currentAnnouncement.linkText}
              </a>
            </>
          )}
        </div>

        <button
          onClick={handleNext}
          className="hover:text-gray-300 transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBanner;
