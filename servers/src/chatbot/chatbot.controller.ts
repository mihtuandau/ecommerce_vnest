import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatbotService } from './chatbot.service';
import { ChatQueryDto } from './dto/chat-query.dto';
import { OptionalJwtAuthGuard } from '../common/guards/auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // Increased limit slightly for better UX
  async chat(@Request() req, @Body() chatQueryDto: ChatQueryDto) {
    const { message, conversationId } = chatQueryDto;
    
    // Security Fix: Get userId from authenticated token, not from request body
    const userId = req.user?.userId;
    
    const result = await this.chatbotService.chat(message, conversationId, userId);
    
    return {
      success: true,
      message: result.response,
      conversationId: result.conversationId,
      productIds: result.productIds,
      suggestions: result.suggestions,
      discounts: result.discounts,
      flashSalePrice: result.flashSalePrice,
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
