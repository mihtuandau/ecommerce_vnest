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
    const allMessages = await this.prisma.chatMessage.findMany({
      select: { roomId: true },
    });

    const uniqueRoomIds = [...new Set(allMessages.map((m) => m.roomId))];

    const rooms: Array<{
      roomId: string;
      unreadCount: number;
      lastMessage: any;
    }> = [];

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
        const unreadCount = await this.prisma.chatMessage.count({
          where: {
            roomId,
            isRead: false,
            sender: {
              role: 'CUSTOMER',
            },
          },
        });

        // Get customer info from roomId (room_{id})
        const userIdRaw = roomId.replace('room_', '');
        const userId = parseInt(userIdRaw);

        let customer: any = null;
        if (!isNaN(userId)) {
          customer = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
          });
        }

        rooms.push({
          roomId,
          unreadCount,
          lastMessage,
          customer,
        } as any);
      }
    }

    rooms.sort((a, b) => {
      const timeA = new Date(a.lastMessage.createdAt).getTime();
      const timeB = new Date(b.lastMessage.createdAt).getTime();
      return timeB - timeA;
    });

    return rooms;
  }
}
