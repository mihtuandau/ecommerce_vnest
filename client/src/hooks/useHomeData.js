import { useState, useEffect } from 'react';
import homeService from '../services/homeService';

/**
 * Custom hook để quản lý data cho homepage
 * Tối ưu performance với error handling và loading state
 */
export const useHomeData = () => {
  const [data, setData] = useState({
    banners: [],
    categories: [],
    featuredProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const homeData = await homeService.getAllData();
      setData(homeData);
    } catch (err) {setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
