import apiService from './apiService';
import { CHATBOT_ENDPOINTS } from '../config/apiConstants';

const chatbotService = {
  async sendMessage(message) {
    try {
      const response = await apiService.post(CHATBOT_ENDPOINTS.CHAT, { message });
      return response;
    } catch (error) {throw error;
    }
  },

  async getStatus() {
    try {
      const response = await apiService.get(CHATBOT_ENDPOINTS.STATUS);
      return response;
    } catch (error) {throw error;
    }
  },
};

export default chatbotService;






