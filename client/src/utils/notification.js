import { toast } from 'sonner';

export const parseErrorMessage = (error, defaultMessage = 'Có lỗi xảy ra') => {
  if (error?.response?.data) {
    const { message, error: errorType, statusCode } = error.response.data;

    if (Array.isArray(message)) {
      return message.join('\n• ');
    }
    
    if (typeof message === 'string') {
      return message;
    }
    
    if (errorType) {
      return `${errorType}${statusCode ? ` (${statusCode})` : ''}`;
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

export const notify = {
  success: (message, options = {}) => {
    toast.success(message, {
      id: message, // Toast ID prevents duplicates
      duration: options.duration || 3000,
      ...options
    });
  },
  error: (message, options = {}) => {
    const errorMessage = typeof message === 'object' && message !== null 
      ? parseErrorMessage(message) 
      : message;
    toast.error(errorMessage, {
      id: errorMessage, // Toast ID prevents duplicates
      duration: options.duration || 5000,
      ...options
    });
  },
  info: (message, options = {}) => {
    toast.info(message, {
      id: message, // Toast ID prevents duplicates
      duration: options.duration || 3000,
      ...options
    });
  },
  warning: (message, options = {}) => {
    toast.warning(message, {
      id: message, // Toast ID prevents duplicates
      duration: options.duration || 4000,
      ...options
    });
  }
};
