import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/apiService';

export const useProductSelector = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [productSearching, setProductSearching] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFilters, setProductFilters] = useState({
    categoryId: '',
    sortBy: 'sold',
    inStock: false,
  });
  const [categories, setCategories] = useState([]);
  const searchTimerRef = useRef(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await apiService.get('/categories');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCategories(list.filter((c) => !c.parentId).map((c) => ({ id: c.id, name: c.name })));
    } catch { }
  }, []);

  const fetchProducts = useCallback(async (overrides = {}) => {
    setProductSearching(true);
    try {
      const merged = { ...productFilters, ...overrides };
      const params = {
        limit: 60,
        sortBy: merged.sortBy || 'sold',
        status: 'active',
        ...(merged.search ? { search: merged.search } : {}),
        ...(merged.categoryId ? { categoryId: merged.categoryId } : {}),
        ...(merged.inStock ? { inStock: true } : {}),
      };
      const res = await apiService.get('/products', params);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProductOptions(
        list.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.basePrice || p.price || 0,
          image: p.images?.[0]?.url || p.image || null,
          categoryId: p.categoryId,
        }))
      );
    } catch { } finally {
      setProductSearching(false);
    }
  }, [productFilters]);

  useEffect(() => {
    fetchProducts({});
    loadCategories();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    const next = { ...productFilters, [key]: value };
    setProductFilters(next);
    fetchProducts({ ...next, search: productSearch });
  }, [productFilters, productSearch, fetchProducts]);

  const handleProductSearchChange = useCallback((e) => {
    const val = e.target.value;
    setProductSearch(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => fetchProducts({ search: val.trim() }), 350);
  }, [fetchProducts]);

  const handleClearSearch = useCallback(() => {
    setProductSearch('');
    fetchProducts({});
  }, [fetchProducts]);

  const handleResetFilters = useCallback(() => {
    const reset = { categoryId: '', sortBy: 'sold', inStock: false };
    setProductFilters(reset);
    fetchProducts(reset);
  }, [fetchProducts]);

  return {
    productOptions,
    productSearching,
    productSearch,
    productFilters,
    categories,
    handleFilterChange,
    handleProductSearchChange,
    handleClearSearch,
    handleResetFilters,
  };
};
