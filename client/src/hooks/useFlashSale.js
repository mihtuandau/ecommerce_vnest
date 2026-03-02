import { useQuery } from '@tanstack/react-query';
import discountService from '../services/discountService';

/**
 * Hook lấy dữ liệu Flash Sale đang diễn ra từ BE.
 * Trả về: { flashSale, isLoading, isError }
 */
export const useFlashSale = () => {
  const { data: flashSale = null, isLoading, isError, error } = useQuery({
    queryKey: ['flash-sale'],
    queryFn: () => discountService.getFlashSale(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { flashSale, isLoading, isError, error };
};

/**
 * Hook lấy map tất cả discount tự động áp dụng (flash + thường) theo productId.
 * Trả về: { discountMap: { [productId]: { percentage, fixedAmount, isFlashSale, endDate } } }
 * Dùng cho ProductCard và Cart để tính giá tự động.
 */
export const useAutoApplyDiscounts = () => {
  const { data: discountMap = {}, isLoading } = useQuery({
    queryKey: ['auto-apply-discounts'],
    queryFn: () => discountService.getAutoApply(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { discountMap, isLoading };
};
