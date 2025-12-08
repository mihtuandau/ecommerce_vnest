import apiService from './apiService';

const chatService = {
  getRooms: async () => {
    const response = await apiService.get('/chat/rooms');
    return response;
  },
};

export default chatService;
