import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(roomId: string, senderId: number, message: string) {
    return this.prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        message,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async getMessages(roomId: string, limit: number = 50) {
    return this.prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
    });
  }

  async markAsRead(roomId: string, userId: number) {
    return this.prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadCount(roomId: string, userId: number) {
    return this.prisma.chatMessage.count({
      where: {
        roomId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
    });
  }

  async getAllRooms() {
    // Get all unique room IDs first
    const allMessages = await this.prisma.chatMessage.findMany({
      select: { roomId: true },
    });

    // Extract unique roomIds
    const uniqueRoomIds = [...new Set(allMessages.map((m) => m.roomId))];

    const rooms: Array<{
      roomId: string;
      unreadCount: number;
      lastMessage: any;
    }> = [];

    // For each unique room, get last message and unread count
    for (const roomId of uniqueRoomIds) {
      const lastMessage = await this.prisma.chatMessage.findFirst({
        where: { roomId },
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (lastMessage) {
        // Get unread count for admin (messages sent by customer that admin hasn't read)
        const unreadCount = await this.prisma.chatMessage.count({
          where: {
            roomId,
            isRead: false,
            sender: {
              role: 'CUSTOMER',
            },
          },
        });

        rooms.push({
          roomId,
          unreadCount,
          lastMessage,
        });
      }
    }

    // Sort by last message time (newest first)
    rooms.sort((a, b) => {
      const timeA = new Date(a.lastMessage.createdAt).getTime();
      const timeB = new Date(b.lastMessage.createdAt).getTime();
      return timeB - timeA;
    });

    return rooms;
  }
}
