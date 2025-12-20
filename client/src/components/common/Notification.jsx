import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { setNotificationInstance } from '../../utils/notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [notification, ...prev]); // Mới nhất lên đầu

    return id; // Trả về id để có thể close manually nếu cần
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration = 5000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration = 6000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message, duration = 4000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration = 5000) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  // Export instance để sử dụng ngoài component
  useEffect(() => {
    setNotificationInstance({ success, error, info, warning });
  }, [success, error, info, warning]);

  return (
    <NotificationContext.Provider value={{ success, error, info, warning, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none w-96 max-w-[calc(100vw-2rem)]">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;
  const [isExiting, setIsExiting] = useState(false);
  const progressRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Thời gian cho exit animation
  }, [id, onClose]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(handleClose, duration);
    }
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'running';
    }
  };

  useEffect(() => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(handleClose, duration);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, handleClose]);

  const config = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-white',
      border: 'border-l-4 border-green-500',
      shadow: 'shadow-lg shadow-green-100/50',
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      textColor: 'text-gray-800',
      title: 'Thành công',
      progressColor: 'bg-green-500'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-white',
      border: 'border-l-4 border-red-500',
      shadow: 'shadow-lg shadow-red-100/50',
      icon: <FaExclamationCircle className="text-red-500 text-xl" />,
      textColor: 'text-gray-800',
      title: 'Lỗi',
      progressColor: 'bg-red-500'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-white',
      border: 'border-l-4 border-amber-500',
      shadow: 'shadow-lg shadow-amber-100/50',
      icon: <FaExclamationTriangle className="text-amber-500 text-xl" />,
      textColor: 'text-gray-800',
      title: 'Cảnh báo',
      progressColor: 'bg-amber-500'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-white',
      border: 'border-l-4 border-blue-500',
      shadow: 'shadow-lg shadow-blue-100/50',
      icon: <FaInfoCircle className="text-blue-500 text-xl" />,
      textColor: 'text-gray-800',
      title: 'Thông tin',
      progressColor: 'bg-blue-500'
    }
  };

  const style = config[type] || config.info;

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.shadow}
        rounded-lg overflow-hidden pointer-events-auto
        transform transition-all duration-300 ease-out
        ${isExiting 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
        }
        hover:shadow-xl hover:scale-[1.02] transition-all duration-200
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">{style.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`text-sm font-semibold ${style.textColor}`}>
                {style.title}
              </h4>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 
                         transition-colors duration-200 p-1 rounded-full
                         hover:bg-gray-100"
                aria-label="Đóng thông báo"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            <p className={`text-sm ${style.textColor} leading-relaxed break-words`}>
              {message}
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress bar với animation mượt mà */}
      {duration > 0 && (
        <div className="h-1 bg-gray-100 overflow-hidden">
          <div 
            ref={progressRef}
            className={`h-full ${style.progressColor} rounded-full`}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`,
              transformOrigin: 'left center'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationProvider;