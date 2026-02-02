import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFireworks } from '../../hooks/useFireworks';

const WelcomeModal = ({ isOpen, onClose }) => {
  const { triggerIntenseFireworks } = useFireworks();

  useEffect(() => {
    if (isOpen) {
      // Delay để hiệu ứng tốt hơn
      const timer = setTimeout(() => {
        triggerIntenseFireworks();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, triggerIntenseFireworks]);

  const handleCelebrate = () => {
    triggerIntenseFireworks();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/5 backdrop-blur-sm z-30 transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-70 flex items-center justify-center animate-slideDown cursor-pointer group bg-black/50 backdrop-blur-sm p-4 pointer-events-none">
        <div className="relative bg-transparent shadow-none max-w-2xl w-full h-auto overflow-hidden pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-lg hover:shadow-xl"
          >
            <X size={24} strokeWidth={2} />
          </button>

          {/* Image Section - Full Modal */}
          <div 
            className="relative w-full h-auto overflow-hidden bg-gray-200 cursor-pointer flex items-center justify-center rounded-xl"
            onClick={handleCelebrate}
          >
            <img
              src="/images-intro.jpg"
              alt="Chào mừng"
              className="w-full h-auto object-contain"
              onError={(e) => {
                console.error('Lỗi load ảnh:', e.target.src);
              }}
            />
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
};

export default WelcomeModal;
