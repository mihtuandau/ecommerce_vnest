// src/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import { notify } from '../utils/notification';

// Hook lấy danh sách products với filters & pagination
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await productService.getAll(filters);
      
      // Backend trả về { data: [], page, limit, total, totalPages }
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
    staleTime: 2 * 60 * 1000, // Cache 2 phút
    placeholderData: (previousData) => previousData, // Giữ data cũ khi refetch
  });
};

// Hook lấy categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productService.getCategories();
      const data = Array.isArray(response?.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      return data;
    },
    staleTime: 10 * 60 * 1000, // Cache 10 phút (categories ít thay đổi)
  });
};

// Hook lấy brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await productService.getBrands();
      const data = Array.isArray(response?.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      return data;
    },
    staleTime: 10 * 60 * 1000, // Cache 10 phút
    retry: false, // Không retry nếu lỗi (brands có thể optional)
  });
};

// Hook lấy chi tiết product
export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook tạo product mới
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

// Hook cập nhật product
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

// Hook xóa product
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

// Hook toggle product status (active/inactive)
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }) => 
      productService.updateStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      const previousData = queryClient.getQueryData(['products']);
      
      // Cập nhật cache tạm thời
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
      // Rollback nếu lỗi
      if (context?.previousData) {
        queryClient.setQueryData(['products'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};