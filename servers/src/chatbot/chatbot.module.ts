import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';
import { ChatbotCartService } from './chatbot-cart.service';
import { ChatbotContextService } from './chatbot-context.service';
import { ChatbotConversationService } from './chatbot-conversation.service';
import { ChatbotTagParserService } from './chatbot-tag-parser.service';

@Module({
  imports: [PrismaModule, SystemSettingsModule],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    ChatbotCartService,
    ChatbotContextService,
    ChatbotConversationService,
    ChatbotTagParserService,
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
