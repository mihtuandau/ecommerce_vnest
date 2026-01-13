import apiService from './apiService';

const uploadService = {
  uploadImages: async (files) => {
    const formData = new FormData();
    
    const fileArray = Array.isArray(files) ? files : [files];
    
    fileArray.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await apiService.post('/upload/images', formData);
    
    return response.urls;
  },
};

export default uploadService;
