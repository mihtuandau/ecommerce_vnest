import { useQuery } from '@tanstack/react-query';
import discountService from '../services/discountService';


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






