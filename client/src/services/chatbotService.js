import apiService from './apiService';

const chatbotService = {
  async sendMessage(message) {
    try {
      const response = await apiService.post('/chatbot/chat', { message });
      return response;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  async getStatus() {
    try {
      const response = await apiService.get('/chatbot/status');
      return response;
    } catch (error) {
      console.error('Error getting chatbot status:', error);
      throw error;
    }
  },
};

export default chatbotService;
