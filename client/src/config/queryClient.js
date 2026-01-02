// src/config/queryClient.js
import { QueryClient } from '@tanstack/react-query';
import { notify } from '../utils/notification';

// Cấu hình QueryClient với các default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data trong 5 phút trước khi coi là stale
      staleTime: 5 * 60 * 1000,
      
      // Giữ cache 10 phút trước khi garbage collect
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 1 lần
      retry: 1,
      
      // Tự động refetch khi window focus
      refetchOnWindowFocus: true,
      
      // Tự động refetch khi reconnect
      refetchOnReconnect: true,
      
      // Không refetch khi mount nếu data còn fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations 0 lần (không retry)
      retry: 0,
      
      // Error handler mặc định cho mutations
      onError: (error) => {
        const message = error?.response?.data?.message || 
                       error?.message || 
                       'Có lỗi xảy ra';
        notify.error(message);
      },
    },
  },
});
