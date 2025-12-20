import apiService from './apiService';

const uploadService = {
  uploadImages: async (files) => {
    const formData = new FormData();
    
    // Nếu files là một file duy nhất, chuyển thành mảng
    const fileArray = Array.isArray(files) ? files : [files];
    
    fileArray.forEach(file => {
      formData.append('files', file);
    });
    
    // Không cần truyền headers vì apiService tự động xử lý multipart/form-data
    const response = await apiService.post('/upload/images', formData);
    
    return response.urls;
  },
};

export default uploadService;
