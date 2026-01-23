import axiosClient from "../config/apiClient";

const apiService = {
  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   * @param {object} headers - Custom headers
   */
  get: async (url, params = {}, headers = {}) => {
    try {
      const response = await axiosClient.get(url, {
        params,
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ GET ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  post: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.post(url, data, {
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ POST ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  put: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.put(url, data, {
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ PUT ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  patch: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.patch(url, data, {
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {object} data - Request body (optional)
   * @param {object} headers - Custom headers
   */
  delete: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.delete(url, {
        data,
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
    @param {string} url 
    @param {FormData} formData 
    @param {object} headers 
    @param {function} onUploadProgress 
   */
  upload: async (url, formData, headers = {}, onUploadProgress = null) => {
    try {
      const response = await axiosClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...headers,
        },
        onUploadProgress: onUploadProgress
          ? (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Upload file with PUT method
   * @param {string} url 
   * @param {FormData} formData 
   * @param {object} headers 
   * @param {function} onUploadProgress 
   */
  uploadPut: async (url, formData, headers = {}, onUploadProgress = null) => {
    try {
      const response = await axiosClient.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...headers,
        },
        onUploadProgress: onUploadProgress
          ? (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          : undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Download file
   * @param {string} url
   * @param {object} params
   * @param {object} headers
   */
  download: async (url, params = {}, headers = {}) => {
    try {
      const response = await axiosClient.get(url, {
        params,
        headers: {
          ...headers,
        },
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiService;
