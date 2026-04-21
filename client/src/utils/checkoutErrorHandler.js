/**
 * Enhanced error handler for checkout errors
 * Maps backend error codes to user-friendly messages and suggestions
 */
export const getCheckoutErrorMessage = (error) => {
  const response = error?.response?.data;
  const errorCode = response?.errorCode || response?.error || 'UNKNOWN_ERROR';
  const message = response?.message || error?.message || 'Có lỗi xảy ra, vui lòng thử lại';

  const errorDetails = {
    OUT_OF_STOCK: {
      title: 'Sản phẩm hết hàng',
      message: message || 'Một hoặc nhiều sản phẩm trong giỏ hàng hiện không có sẵn',
      suggestion: 'Vui lòng cập nhật giỏ hàng của bạn'
    },
    INVALID_DISCOUNT: {
      title: 'Mã giảm giá không hợp lệ',
      message: message,
      suggestion: 'Kiểm tra lại mã giảm giá hoặc loại bỏ nó để tiếp tục'
    },
    EMPTY_CART: {
      title: 'Giỏ hàng trống',
      message: message || 'Không có sản phẩm nào để checkout',
      suggestion: 'Vui lòng thêm sản phẩm vào giỏ hàng'
    },
    INSUFFICIENT_STOCK: {
      title: 'Không đủ hàng tồn kho',
      message: message || 'Một hoặc nhiều sản phẩm không đủ số lượng yêu cầu',
      suggestion: 'Vui lòng giảm số lượng hoặc chọn sản phẩm khác'
    },
    VALIDATION_ERROR: {
      title: 'Lỗi nhập liệu',
      message: message || 'Vui lòng kiểm tra lại thông tin của bạn',
      suggestion: 'Đảm bảo tất cả các trường bắt buộc đã được điền đủ'
    },
    PAYMENT_ERROR: {
      title: 'Lỗi thanh toán',
      message: message || 'Không thể khởi tạo thanh toán',
      suggestion: 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác'
    },
    NOT_FOUND: {
      title: 'Không tìm thấy',
      message: message || 'Một hoặc nhiều sản phẩm không tồn tại',
      suggestion: 'Vui lòng làm mới trang và thử lại'
    },
    UNAUTHORIZED: {
      title: 'Không được phép',
      message: 'Phiên đăng nhập của bạn đã hết hạn',
      suggestion: 'Vui lòng đăng nhập lại'
    },
    DEFAULT: {
      title: 'Lỗi checkout',
      message: message,
      suggestion: 'Vui lòng thử lại hoặc liên hệ hỗ trợ'
    }
  };

  return errorDetails[errorCode] || errorDetails.DEFAULT;
};

/**
 * Format error response for display
 */
export const formatCheckoutError = (error) => {
  const errorInfo = getCheckoutErrorMessage(error);
  
  // If there are specific item details, include them
  const details = error?.response?.data?.details;
  if (details && Array.isArray(details)) {
    const itemErrors = details
      .filter(item => !item.canCheckout)
      .map(item => item.reason)
      .join('\n');
    
    return {
      ...errorInfo,
      message: `${errorInfo.message}\n\n${itemErrors}`
    };
  }

  return errorInfo;
};
