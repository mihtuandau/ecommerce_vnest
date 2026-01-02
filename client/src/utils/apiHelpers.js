// src/utils/apiHelpers.js

/**
 * Normalize API response structure
 */
export const normalizeResponse = (response) => {
  // Handle different response structures
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  if (response?.data?.data) return response.data.data;
  if (response?.data) return response.data;
  return response;
};

/**
 * Extract pagination from response
 */
export const extractPagination = (response, defaults = {}) => {
  const data = response?.data || response;
  return {
    total: data?.total || defaults.total || 0,
    totalPages: data?.totalPages || defaults.totalPages || 1,
    page: data?.page || defaults.page || 1,
    limit: data?.limit || defaults.limit || 10,
  };
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error) => {
  const message = 
    error?.response?.data?.message || 
    error?.message || 
    'Có lỗi xảy ra';
  
  const status = error?.response?.status;
  const code = error?.response?.data?.code;

  return { message, status, code };
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || isAuthError(error)) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};
