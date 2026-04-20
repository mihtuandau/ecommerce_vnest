
export const formatPrice = (price) => {
  if (price === 0 || price === '0') return '0 ₫';
  if (!price && price !== 0 || isNaN(price)) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};


export const formatNumber = (number) => {
  if (!number || isNaN(number)) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
};


export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};


export const formatDateTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};


export const calculateDiscountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};


export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


export const getTotalStock = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
};


export const getStockStatus = (stock) => {
  const n = Number(stock) || 0;
  if (n === 0) {
    return {
      text: 'Hết hàng',
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    };
  }
  if (n < 10) {
    return {
      text: 'Sắp hết',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    };
  }
  return {
    text: 'Còn hàng',
    color: 'text-black bg-gray-50 border-gray-200'
  };
};



export const computeDiscountFromMap = (productId, originalPrice, discountMap) => {
  if (!discountMap || !productId) return originalPrice;
  const d = discountMap[Number(productId)];
  if (!d) return originalPrice;
  if (d.percentage) return Math.round(originalPrice * (1 - d.percentage / 100));
  if (d.fixedAmount) return Math.max(0, originalPrice - d.fixedAmount);
  return originalPrice;
};


export const computeFlashPrice = (productId, originalPrice, flashSale) => {
  if (!flashSale || !productId) return originalPrice;
  const list = flashSale.applicableToProducts;
  if (!list?.length || !list.includes(Number(productId))) return originalPrice;
  if (flashSale.percentage) return Math.round(originalPrice * (1 - flashSale.percentage / 100));
  if (flashSale.fixedAmount) return Math.max(0, originalPrice - flashSale.fixedAmount);
  return originalPrice;
};


export const getTimeLeft = (endDate) => {
  if (!endDate) return null;
  
  let targetDate;
  
  if (typeof endDate === 'string') {
    targetDate = new Date(endDate);
  } else {
    targetDate = new Date(endDate);
  }
  
  if (isNaN(targetDate.getTime())) return null;
  
  const diff = targetDate.getTime() - Date.now();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    expired: false,
  };
};






