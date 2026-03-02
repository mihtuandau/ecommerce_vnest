/**
 * Format price to Vietnamese currency
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

/**
 * @param {number} number 
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (!number || isNaN(number)) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

/**
 * Format datetime to Vietnamese format
 * @param {string|Date} date - Datetime to format
 * @returns {string} Formatted datetime string
 */
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

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate total stock from product variants
 * @param {Array} variants - Array of product variants
 * @returns {number} Total stock count
 */
export const getTotalStock = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
};

/**
 * Get stock status with color styling
 * @param {number} stock - Stock quantity
 * @returns {Object} Status object with text and color class
 */
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
    color: 'text-[#00a85a] bg-green-50 border-green-200'
  };
};

/**
 * Tính giá sau khi áp dụng discount tự động từ map { productId: {percentage, fixedAmount} }.
 * @param {number|string} productId
 * @param {number} originalPrice
 * @param {object} discountMap  - object từ useAutoApplyDiscounts()
 * @returns {number}
 */
export const computeDiscountFromMap = (productId, originalPrice, discountMap) => {
  if (!discountMap || !productId) return originalPrice;
  const d = discountMap[Number(productId)];
  if (!d) return originalPrice;
  if (d.percentage) return Math.round(originalPrice * (1 - d.percentage / 100));
  if (d.fixedAmount) return Math.max(0, originalPrice - d.fixedAmount);
  return originalPrice;
};

/**
 * Tính giá sau khi áp dụng flash sale cho một sản phẩm.
 * @deprecated Dùng computeDiscountFromMap thay thế
 */
export const computeFlashPrice = (productId, originalPrice, flashSale) => {
  if (!flashSale || !productId) return originalPrice;
  const list = flashSale.applicableToProducts;
  if (!list?.length || !list.includes(Number(productId))) return originalPrice;
  if (flashSale.percentage) return Math.round(originalPrice * (1 - flashSale.percentage / 100));
  if (flashSale.fixedAmount) return Math.max(0, originalPrice - flashSale.fixedAmount);
  return originalPrice;
};
