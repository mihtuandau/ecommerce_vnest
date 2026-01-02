// src/hooks/usePayments.js
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentService from '../services/paymentService';
import { notify } from '../utils/notification';

// Hook lấy danh sách payments với filtering
export const usePayments = (filters = {}) => {
  const { data: rawData, ...queryResult } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentService.getPayments(),
    staleTime: 2 * 60 * 1000,
  });

  // Normalize data structure
  const payments = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
    if (rawData.payments && Array.isArray(rawData.payments)) return rawData.payments;
    return [];
  }, [rawData]);

  // Client-side filtering & sorting
  const filtered = useMemo(() => {
    let result = [...payments];
    const { 
      search = '', 
      status = '', 
      method = '', 
      sortField = 'createdAt', 
      sortOrder = 'desc' 
    } = filters;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p => 
        p.orderId?.toString().includes(searchLower) ||
        p.transactionId?.toLowerCase().includes(searchLower) ||
        p.order?.orderNumber?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (status) {
      result = result.filter(p => p.status === status);
    }

    // Method filter
    if (method) {
      result = result.filter(p => p.method === method);
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let va = sortField === 'createdAt' ? new Date(a[sortField]).getTime() : a[sortField] || 0;
        let vb = sortField === 'createdAt' ? new Date(b[sortField]).getTime() : b[sortField] || 0;
        return (va < vb ? -1 : va > vb ? 1 : 0) * (sortOrder === 'asc' ? 1 : -1);
      });
    }

    return result;
  }, [payments, filters]);

  // Stats
  const stats = useMemo(() => {
    // Support both COMPLETED and SUCCESS status
    const isCompleted = (p) => p.status === 'COMPLETED' || p.status === 'SUCCESS';
    
    return {
      total: payments.length,
      completed: payments.filter(isCompleted).length,
      pending: payments.filter(p => p.status === 'PENDING').length,
      failed: payments.filter(p => p.status === 'FAILED').length,
      totalAmount: payments
        .filter(isCompleted)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    };
  }, [payments]);

  return { 
    ...queryResult, 
    data: filtered, 
    payments, 
    stats 
  };
};

// Hook xử lý refund
export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, amount, reason }) => 
      paymentService.refund(paymentId, { amount, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      notify.success('Hoàn tiền thành công');
    },
    onError: (error) => {
      notify.error(error?.response?.data?.message || 'Không thể hoàn tiền');
    }
  });
};
