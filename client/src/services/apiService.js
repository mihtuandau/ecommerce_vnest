import axiosClient from "../config/apiClient";

const apiService = {
  
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
      console.error(` GET ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  
  post: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.post(url, data, {
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(` POST ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  
  put: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosClient.put(url, data, {
        headers: {
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(` PUT ${url} error:`, {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        data: error.response?.data,
        fullError: error.message
      });
      throw error.response?.data || error;
    }
  },

  
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






