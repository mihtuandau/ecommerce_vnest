import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import { notify } from '../utils/notification';

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await productService.getAll(filters);
      
      const productsData = response?.data?.data || response?.data || [];
      const pagination = {
        total: response?.data?.total || 0,
        totalPages: response?.data?.totalPages || 1,
        page: response?.data?.page || filters.page || 1,
        limit: response?.data?.limit || filters.limit || 10,
      };
      
      return {
        products: productsData,
        pagination,
      };
    },
    staleTime: 2 * 60 * 1000, 
    placeholderData: (previousData) => previousData, 
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productService.getCategories();
      const data = Array.isArray(response?.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      return data;
    },
    staleTime: 10 * 60 * 1000, 
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await productService.getBrands();
      const data = Array.isArray(response?.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      return data;
    },
    staleTime: 10 * 60 * 1000,
    retry: false, 
  });
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData) => productService.create(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      notify.success('Tạo sản phẩm thành công');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      notify.success('Cập nhật sản phẩm thành công');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId) => productService.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      notify.success('Xóa sản phẩm thành công');
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }) => 
      productService.updateStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      const previousData = queryClient.getQueryData(['products']);
     
      queryClient.setQueriesData(['products'], (old) => {
        if (!old?.products) return old;
        return {
          ...old,
          products: old.products.map(p => 
            p.id === id ? { ...p, isActive } : p
          ),
        };
      });
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};





