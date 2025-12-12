// Utility để import dễ dàng hơn
// Thay vì import toast from 'react-hot-toast'
// Chỉ cần import { notify } from './utils/notification'

let notificationInstance = null;

export const setNotificationInstance = (instance) => {
  notificationInstance = instance;
};

export const notify = {
  success: (message, duration = 3000) => {
    if (notificationInstance) {
      notificationInstance.success(message, duration);
    }
  },
  error: (message, duration = 3000) => {
    if (notificationInstance) {
      notificationInstance.error(message, duration);
    }
  },
  info: (message, duration = 3000) => {
    if (notificationInstance) {
      notificationInstance.info(message, duration);
    }
  },
  warning: (message, duration = 3000) => {
    if (notificationInstance) {
      notificationInstance.warning(message, duration);
    }
  }
};
