import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, ChatbotModule, UploadModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
