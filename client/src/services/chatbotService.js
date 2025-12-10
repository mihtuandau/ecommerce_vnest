import apiService from './apiService';

const chatbotService = {
  async sendMessage(message) {
    try {
      const response = await apiService.post('/chatbot/chat', { message });
      return response;
    } catch (error) {throw error;
    }
  },

  async getStatus() {
    try {
      const response = await apiService.get('/chatbot/status');
      return response;
    } catch (error) {throw error;
    }
  },
};

export default chatbotService;
