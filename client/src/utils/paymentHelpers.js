import { formatPrice, formatDateTime } from './formatters';

export const formatCurrency = formatPrice;
export const formatDate = formatDateTime;

export const getStatusVariant = (status) => {
  const variants = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'danger',
    REFUNDED: 'info',
  };
  return variants[status] || 'default';
};

export const getStatusText = (status) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
  };
  return texts[status] || status;
};

export const getMethodText = (method) => {
  const texts = {
    CASH: 'Tiền mặt',
    CARD: 'Thẻ ngân hàng',
    VNPAY: 'VNPay',
    MOMO: 'MoMo',
  };
  return texts[method] || method;
};






