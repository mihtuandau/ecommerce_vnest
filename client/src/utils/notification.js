let notificationInstance = null;

export const setNotificationInstance = (instance) => {
  notificationInstance = instance;
};

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
    if (notificationInstance) {
      const duration = options.duration || 3000;
      notificationInstance.success(message, duration);
    }
  },
  error: (message, options = {}) => {
    if (notificationInstance) {
      const duration = options.duration || 5000;
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
