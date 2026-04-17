import { createContext, useContext, useCallback } from 'react';
import { toast, Toaster } from 'sonner';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const success = useCallback((message, duration = 3000) => {
    return toast.success(message, { id: message, duration });
  }, []);

  const error = useCallback((message, duration = 5000) => {
    return toast.error(message, { id: message, duration });
  }, []);

  const info = useCallback((message, duration = 3000) => {
    return toast.info(message, { id: message, duration });
  }, []);

  const warning = useCallback((message, duration = 4000) => {
    return toast.warning(message, { id: message, duration });
  }, []);

  const removeNotification = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return (
    <NotificationContext.Provider value={{ success, error, info, warning, removeNotification }}>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        expand={false}
        theme="light"
      />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;