
import { QueryClient } from '@tanstack/react-query';
import { notify } from '../utils/notification';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      staleTime: 5 * 60 * 1000,

      gcTime: 10 * 60 * 1000,

      retry: 1,

      refetchOnWindowFocus: true,

      refetchOnReconnect: true,

      refetchOnMount: true,
    },
    mutations: {

      retry: 0,

      onError: (error) => {
        const message = error?.response?.data?.message || 
                       error?.message || 
                       'Có lỗi xảy ra';
        notify.error(message);
      },
    },
  },
});






