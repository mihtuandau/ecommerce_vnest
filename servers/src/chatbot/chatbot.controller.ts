import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatQueryDto } from './dto/chat-query.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  async chat(@Body() chatQueryDto: ChatQueryDto) {
    const { message } = chatQueryDto;
    const response = await this.chatbotService.chat(message);
    
    return {
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('status')
  async getStatus() {
    const status = this.chatbotService.getAIStatus();
    return {
      success: true,
      ai: status,
    };
  }
}








