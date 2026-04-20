import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bannerService from '../services/bannerService';
import { notify } from '../utils/notification';

export const useBanners = (activeOnly = false) => {
  return useQuery({
    queryKey: ['banners', activeOnly],
    queryFn: () => bannerService.getAll(activeOnly),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => bannerService.create(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      notify.success('Tạo banner thành công');
    },
    onError: () => {
      notify.error('Không thể tạo banner');
    }
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => bannerService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      notify.success('Cập nhật banner thành công');
    },
    onError: () => {
      notify.error('Không thể cập nhật banner');
    }
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      notify.success('Xóa banner thành công');
    },
    onError: () => {
      notify.error('Không thể xóa banner');
    }
  });
};

export const useReorderBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bannerId, direction }) => bannerService.reorder(bannerId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: () => {
      notify.error('Không thể thay đổi thứ tự banner');
    }
  });
};
export const useToggleBannerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bannerService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      notify.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      notify.error('Không thể cập nhật trạng thái');
    }
  });
};






