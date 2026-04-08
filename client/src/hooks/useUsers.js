
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { notify } from '../utils/notification';

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const data = await userService.getUsers(params);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000, 
  });
};

export const useUser = (userId) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId, 
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notify.success('Tạo người dùng thành công');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      notify.success('Cập nhật người dùng thành công');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (response?.action === 'DEACTIVATED') {
        notify.success('Tài khoản đã được vô hiệu hóa');
      } else {
        notify.success('Tài khoản đã được xóa mềm');
      }
    },
  });
};