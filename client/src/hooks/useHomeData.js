// src/hooks/useHomeData.js
import { useQuery } from '@tanstack/react-query';
import homeService from '../services/homeService';

export const useHomeData = () => {
  return useQuery({
    queryKey: ['home-data'],
    queryFn: async () => {
      const data = await homeService.getAllData();
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút (home data ít thay đổi)
    gcTime: 10 * 60 * 1000, // Giữ cache 10 phút
  });
};
