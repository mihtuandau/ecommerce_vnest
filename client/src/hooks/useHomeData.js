import { useQuery } from '@tanstack/react-query';
import homeService from '../services/homeService';

export const useHomeData = () => {
  return useQuery({
    queryKey: ['home-data'],
    queryFn: async () => {
      const data = await homeService.getAllData();
      return data;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
};
