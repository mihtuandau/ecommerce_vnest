import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  // Helper: Extract data from response
  const extractData = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(filters);
      
      // Backend trả về { data: [], page, limit, total, totalPages }
      const productsData = response?.data?.data || response?.data || [];
      const total = response?.data?.total || 0;
      const totalPagesFromAPI = response?.data?.totalPages || 1;
      
      setProducts(productsData);
      setTotalPages(totalPagesFromAPI);
    } catch (error) {toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();
      const categoriesData = extractData(response);
      setCategories(categoriesData);
    } catch (error) {toast.error('Không thể tải danh mục');
      setCategories([]);
    }
  }, []);

  // Load brands
  const loadBrands = useCallback(async () => {
    try {
      const response = await productService.getBrands();
      const brandsData = extractData(response);
      setBrands(brandsData);
    } catch (error) {toast.error('Không thể tải thương hiệu');
      setBrands([]);
    }
  }, []);

  // Load all data
  const loadAllData = useCallback(async () => {
    await Promise.all([loadCategories(), loadBrands(), loadProducts()]);
  }, [loadCategories, loadBrands, loadProducts]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  // Auto reload when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, loadProducts]);

  return {
    products,
    categories,
    brands,
    loading,
    filters,
    totalPages,
    loadProducts,
    updateFilters
  };
};