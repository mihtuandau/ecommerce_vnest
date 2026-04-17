import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private aiAvailable = false;

  constructor(private prisma: PrismaService) {
    this.initializeGemini();
  }

  private initializeGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      this.logger.warn(' GEMINI_API_KEY not found. Chatbot will use database-only mode.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);

      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.aiAvailable = true;

    } catch (error) {
      this.logger.error(' Failed to initialize Gemini:', error.message);
      this.aiAvailable = false;
    }
  }

  async chat(message: string): Promise<string> {

    if (!this.aiAvailable || !this.model) {
      return 'Xin lỗi, hệ thống AI chưa sẵn sàng. Vui lòng thử lại sau.';
    }

    try {

      const prompt = `Bạn là trợ lý AI thân thiện của một cửa hàng thời trang trực tuyến. Hãy trả lời câu hỏi của khách hàng một cách ngắn gọn, hữu ích và chuyên nghiệp bằng tiếng Việt.

Câu hỏi của khách hàng: ${message}

Hãy trả lời:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return response || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.';
    } catch (error: any) {
      this.logger.error(' Gemini AI error:', error.message);
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return 'Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút.';
      }
      
      return 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
    }
  }

   

  getAIStatus(): { available: boolean; provider: string } {
    return {
      available: this.aiAvailable,
      provider: this.aiAvailable ? 'Gemini AI' : 'Unavailable'
    };
  }
}






