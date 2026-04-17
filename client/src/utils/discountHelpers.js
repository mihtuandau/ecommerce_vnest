import { formatPrice, formatDateTime, formatDate } from './formatters';

export const formatCurrency = formatPrice;

export const formatDateTimeDisplay = formatDateTime;

export const formatDateShort = formatDate;

export const getStatusVariant = (status) => {
  const variants = {
    active: 'success',
    expired: 'danger',
    upcoming: 'warning',
  };
  return variants[status] || 'secondary';
};

export const getStatusText = (status) => {
  const texts = {
    active: 'Đang hoạt động',
    expired: 'Đã hết hạn',
    upcoming: 'Sắp diễn ra',
  };
  return texts[status] || status;
};

export const getDiscountTypeText = (discount) => {
  if (discount.percentage) {
    return `${discount.percentage}%`;
  }
  if (discount.fixedAmount) {
    return formatCurrency(discount.fixedAmount);
  }
  return '-';
};

export const calculateDiscountAmount = (discount, orderTotal) => {
  if (discount.percentage) {
    return (orderTotal * discount.percentage) / 100;
  }
  if (discount.fixedAmount) {
    return Math.min(discount.fixedAmount, orderTotal);
  }
  return 0;
};






