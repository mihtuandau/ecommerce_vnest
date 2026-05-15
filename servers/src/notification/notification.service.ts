import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(userId: number, id: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getSettings(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationSettings: true },
    });
    return user?.notificationSettings || {};
  }

  async updateSettings(userId: number, dto: UpdateNotificationSettingsDto) {
    const currentSettings = await this.getSettings(userId);
    const newSettings = { ...(currentSettings as object), ...dto };

    return this.prisma.user.update({
      where: { id: userId },
      data: { notificationSettings: newSettings },
      select: { notificationSettings: true },
    });
  }

  async createNotification(userId: number, data: { title: string; content: string; type: string; link?: string }) {
    // In a real app, you might check user preferences here before creating
    return this.prisma.notification.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}
