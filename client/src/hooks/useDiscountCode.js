import { useState } from 'react';
import toast from 'react-hot-toast';
import discountService from '../services/discountService';
import { formatPrice } from '../utils/formatters';

export const useDiscountCode = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setCheckingDiscount(true);
      const result = await discountService.validateDiscount(discountCode);if (result && result.isValid) {
        setAppliedDiscount(result.discount);
        toast.success(
          `Áp dụng mã giảm giá thành công! Giảm ${
            result.discount.discountType === 'PERCENTAGE' 
              ? result.discount.discountValue + '%' 
              : formatPrice(result.discount.discountValue)
          }`
        );
      } else {
        toast.error(result?.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {toast.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    toast.success('Đã xóa mã giảm giá');
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