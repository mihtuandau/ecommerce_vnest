import apiService from './apiService';
import { CHAT_ENDPOINTS } from '../config/apiConstants';

const chatService = {
  getRooms: async () => {
    const response = await apiService.get(CHAT_ENDPOINTS.ROOMS);
    return response;
  },
};

export default chatService;
