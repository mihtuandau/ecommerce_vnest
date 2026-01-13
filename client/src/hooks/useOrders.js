import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../services/orderService';
import { notify } from '../utils/notification';

export const useOrders = (params = {}, filters = {}) => {
  const { data: rawData, ...queryResult } = useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await orderService.getOrders(params);
      // Normalize response to always return array
      if (Array.isArray(response)) return response;
      if (response?.data && Array.isArray(response.data)) return response.data;
      if (response?.orders && Array.isArray(response.orders)) return response.orders;
      return [];
    },
    staleTime: 1 * 60 * 1000,
  });

  const orders = Array.isArray(rawData) ? rawData : [];

  const filtered = useMemo(() => {
    let result = [...orders];
    const { search = '', sortBy = 'createdAt', sortDir = 'desc' } = filters;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(search) ||
        order.user?.email?.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let va = sortBy === 'total' ? (a.total || 0) : 
               sortBy === 'createdAt' ? new Date(a.createdAt).getTime() : 
               a[sortBy] || '';
      let vb = sortBy === 'total' ? (b.total || 0) : 
               sortBy === 'createdAt' ? new Date(b.createdAt).getTime() : 
               b[sortBy] || '';
      return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === 'asc' ? 1 : -1);
    });

    return result;
  }, [orders, filters]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    revenue: orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + (o.total || 0), 0)
  }), [orders]);

  return { ...queryResult, data: filtered, orders, stats };
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notify.success('Tạo đơn hàng thành công');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => orderService.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      notify.success('Cập nhật trạng thái thành công');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      notify.success('Hủy đơn hàng thành công');
    },
  });
};
