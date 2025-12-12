import { useState } from 'react';
import { notify } from '../utils/notification';
import discountService from '../services/discountService';
import { formatPrice } from '../utils/formatters';

export const useDiscountCode = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      notify.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setCheckingDiscount(true);
      const result = await discountService.validateDiscount(discountCode);if (result && result.isValid) {
        setAppliedDiscount(result.discount);
        notify.success(
          `Áp dụng mã giảm giá thành công! Giảm ${
            result.discount.discountType === 'PERCENTAGE' 
              ? result.discount.discountValue + '%' 
              : formatPrice(result.discount.discountValue)
          }`
        );
      } else {
        notify.error(result?.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {notify.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    notify.success('Đã xóa mã giảm giá');
  };

  return {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    checkingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount
  };
};