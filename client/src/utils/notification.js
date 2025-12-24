

let notificationInstance = null;

export const setNotificationInstance = (instance) => {
  notificationInstance = instance;
};

/**
 * Parse error message from API response
 * Handles various error formats from backend
 */
export const parseErrorMessage = (error, defaultMessage = 'Có lỗi xảy ra') => {
  // Check if error has response from server
  if (error?.response?.data) {
    const { message, error: errorType, statusCode } = error.response.data;
    
    // Handle validation errors (array of messages)
    if (Array.isArray(message)) {
      return message.join('\n• ');
    }
    
    // Handle single message
    if (typeof message === 'string') {
      return message;
    }
    
    // Handle error type
    if (errorType) {
      return `${errorType}${statusCode ? ` (${statusCode})` : ''}`;
    }
  }
  
  // Handle error.message (client-side errors)
  if (error?.message) {
    return error.message;
  }
  
  // Default fallback
  return defaultMessage;
};

export const notify = {
  success: (message, options = {}) => {
    if (notificationInstance) {
      const duration = options.duration || 3000;
      notificationInstance.success(message, duration);
    }
  },
  error: (message, options = {}) => {
    if (notificationInstance) {
      const duration = options.duration || 5000; // Longer duration for errors
      const errorMessage = typeof message === 'object' && message !== null 
        ? parseErrorMessage(message) 
        : message;
      notificationInstance.error(errorMessage, duration);
    }
  },
  info: (message, options = {}) => {
    if (notificationInstance) {
      const duration = options.duration || 3000;
      notificationInstance.info(message, duration);
    }
  },
  warning: (message, options = {}) => {
    if (notificationInstance) {
      const duration = options.duration || 4000;
      notificationInstance.warning(message, duration);
    }
  }
};
