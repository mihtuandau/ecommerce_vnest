import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import discountService from '../services/discountService';
import { notify } from '../utils/notification';
import { formatPrice } from '../utils/formatters';

export const useDiscounts = (params = {}, filters = {}) => {
  const { data: discounts = [], ...queryResult } = useQuery({
    queryKey: ['discounts', params],
    queryFn: () => discountService.getDiscounts(params),
    staleTime: 3 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    let result = [...discounts];
    const { search = '', status = 'all', sortKey = '', sortDir = 'desc' } = filters;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(d => 
        d.code.toLowerCase().includes(searchLower) ||
        d.description?.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      result = result.filter(d => d.status === status);
    }

    if (sortKey) {
      result.sort((a, b) => {
        let va = sortKey.includes('Date') ? new Date(a[sortKey]).getTime() : a[sortKey] || 0;
        let vb = sortKey.includes('Date') ? new Date(b[sortKey]).getTime() : b[sortKey] || 0;
        return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === 'asc' ? 1 : -1);
      });
    }

    return result;
  }, [discounts, filters]);

  const stats = useMemo(() => {
    const now = new Date();
    
    const getDiscountStatus = (discount) => {
      const startDate = discount.startDate ? new Date(discount.startDate) : null;
      const endDate = discount.endDate ? new Date(discount.endDate) : null;
      
      if (endDate && endDate < now) {
        return 'EXPIRED';
      }
      
      if (startDate && startDate > now) {
        return 'UPCOMING';
      }
      
      if ((!startDate || startDate <= now) && (!endDate || endDate >= now)) {
        return 'ACTIVE';
      }
      
      return discount.status || 'UNKNOWN';
    };
    
    return {
      total: discounts.length,
      active: discounts.filter(d => getDiscountStatus(d) === 'ACTIVE').length,
      expired: discounts.filter(d => getDiscountStatus(d) === 'EXPIRED').length,
      upcoming: discounts.filter(d => getDiscountStatus(d) === 'UPCOMING').length,
      totalUsage: discounts.reduce((sum, d) => sum + (d.usageCount || 0), 0)
    };
  }, [discounts]);

  return { ...queryResult, data: filtered, discounts, stats };
};

export const useDiscountCode = () => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);

  const validate = useMutation({
    mutationFn: () => discountService.validateDiscount(code),
    onSuccess: (result) => {
      if (result?.isValid) {
        setApplied(result.discount);
        const amount = result.discount.discountType === 'PERCENTAGE' 
          ? `${result.discount.discountValue}%` 
          : formatPrice(result.discount.discountValue);
        notify.success(`Áp dụng mã giảm giá thành công! Giảm ${amount}`);
      } else {
        notify.error(result?.message || 'Mã giảm giá không hợp lệ');
      }
    },
    onError: (error) => {
      notify.error(error?.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  });

  const remove = () => {
    setApplied(null);
    setCode('');
    notify.success('Đã xóa mã giảm giá');
  };

  return {
    code, setCode, applied, 
    isChecking: validate.isPending,
    apply: () => validate.mutate(),
    remove
  };
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => discountService.createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      notify.success('Tạo mã giảm giá thành công');
    },
  });
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => discountService.updateDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      notify.success('Cập nhật mã giảm giá thành công');
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => discountService.deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      notify.success('Xóa mã giảm giá thành công');
    },
  });
};
