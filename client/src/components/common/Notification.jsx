import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
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

  const addNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    addNotification(message, 'warning', duration);
  }, [addNotification]);

  // Export instance để sử dụng ngoài component
  useEffect(() => {
    setNotificationInstance({ success, error, info, warning });
  }, [success, error, info, warning]);

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
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
  const { id, message, type } = notification;

  const config = {
    success: {
      bg: 'bg-white',
      border: 'border-l-4 border-green-500',
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      textColor: 'text-gray-900'
    },
    error: {
      bg: 'bg-white',
      border: 'border-l-4 border-red-500',
      icon: <FaExclamationCircle className="text-red-500 text-xl" />,
      textColor: 'text-gray-900'
    },
    warning: {
      bg: 'bg-white',
      border: 'border-l-4 border-yellow-500',
      icon: <FaExclamationCircle className="text-yellow-500 text-xl" />,
      textColor: 'text-gray-900'
    },
    info: {
      bg: 'bg-white',
      border: 'border-l-4 border-blue-500',
      icon: <FaInfoCircle className="text-blue-500 text-xl" />,
      textColor: 'text-gray-900'
    }
  };

  const style = config[type] || config.info;

  return (
    <div
      className={`${style.bg} ${style.border} shadow-lg rounded-r-lg overflow-hidden pointer-events-auto animate-slideInRight max-w-md`}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="flex-shrink-0">{style.icon}</div>
        <p className={`flex-1 text-sm font-medium ${style.textColor}`}>{message}</p>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div 
          className="h-full bg-gray-900"
          style={{
            animation: `shrink ${notification.duration}ms linear forwards`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationProvider;
