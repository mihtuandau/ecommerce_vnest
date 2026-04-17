import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCache } from '../utils/performanceHelpers';

export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const {
    cache = true,
    cacheTTL = 5 * 60 * 1000,
    cacheKey = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const getCacheKey = useCallback(() => {
    return cacheKey || `${fetchFn.toString()}-${JSON.stringify(dependencies)}`;
  }, [fetchFn, dependencies, cacheKey]);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      if (cache && !skipCache) {
        const key = getCacheKey();
        const cachedData = apiCache.get(key);
        if (cachedData) {
          if (mountedRef.current) {
            setData(cachedData);
            setLoading(false);
          }
          return cachedData;
        }
      }

      const result = await fetchFn();

      if (mountedRef.current) {
        setData(result);
        if (cache) {
          const key = getCacheKey();
          apiCache.set(key, result);
        }
      }

      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'An error occurred');
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, cache, getCacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useDebouncedSearch = (searchFn, delay = 500) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (searchTerm) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchFn(searchTerm);
      }, delay);
    },
    [searchFn, delay]
  );
};

export const useIsMounted = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};






