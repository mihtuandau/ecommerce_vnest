import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotConversationService {
  private readonly logger = new Logger(ChatbotConversationService.name);

  constructor(private prisma: PrismaService) {}

  async cleanupGuestConversations() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const deleted = await this.prisma.aiConversation.deleteMany({
      where: {
        userId: null,
        updatedAt: { lte: yesterday },
      },
    });

    return deleted.count;
  }

  async getOrCreateConversation(id?: string, userId?: number) {
    if (id) {
      const conversation = await this.prisma.aiConversation.findUnique({
        where: { id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      if (conversation) {
        if (conversation.userId && conversation.userId !== userId) {
          this.logger.warn(
            `User ${userId || 'guest'} tried to access conversation ${conversation.id} owned by user ${conversation.userId}`,
          );
          return this.createConversation(userId);
        }

        if (!conversation.userId && userId) {
          return this.prisma.aiConversation.update({
            where: { id: conversation.id },
            data: { userId },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
          });
        }

        return conversation;
      }
    }

    return this.createConversation(userId);
  }

  async saveMessage(
    conversationId: string,
    userMessage: string,
    aiMessage: string,
    productIds: number[],
  ) {
    try {
      await this.prisma.$transaction([
        this.prisma.aiMessage.create({
          data: { conversationId, role: 'USER', content: userMessage },
        }),
        this.prisma.aiMessage.create({
          data: {
            conversationId,
            role: 'MODEL',
            content: aiMessage,
            productIds,
          },
        }),
      ]);
      await this.prisma.aiConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    } catch (error) {
      this.logger.error('Save Message Error:', this.getErrorMessage(error));
    }
  }

  private createConversation(userId?: number) {
    return this.prisma.aiConversation.create({
      data: { userId: userId || null },
      include: { messages: true },
    });
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
