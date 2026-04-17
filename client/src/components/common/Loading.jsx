import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

const Loading = memo(({ 
  size = 'md', 
  text = 'Đang tải...', 
  fullScreen = false,
  className = '',
  variant = 'user' // 'user' (green) or 'admin' (blue)
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;
  
  // Color based on variant
  const color = variant === 'admin' ? '#1890ff' : '#000000';

  if (fullScreen) {
    return (
      <>
        {/* Loading Spinner Overlay */}
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-spin-dot loading-dot" style={{ animationDelay: '0s', backgroundColor: color }}></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-spin-dot loading-dot" style={{ animationDelay: '0.2s', backgroundColor: color }}></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-spin-dot loading-dot" style={{ animationDelay: '0.4s', backgroundColor: color }}></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-spin-dot loading-dot" style={{ animationDelay: '0.6s', backgroundColor: color }}></div>
          </div>
        </div>
        
        <style>{`
          @keyframes spin-dot {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          .animate-spin-dot {
            animation: spin-dot 0.8s ease-in-out infinite;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className={`${iconSize} animate-spin loading-icon mb-3`} style={{ color }} />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
