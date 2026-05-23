import { Injectable } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationSettingsDto } from './dto/update-settings.dto';

type NotificationPayload = {
  title: string;
  content: string;
  type: string;
  link?: string;
};

type NotificationPreferences = {
  orderStatus?: boolean;
  promotions?: boolean;
  newsletter?: boolean;
  security?: boolean;
};

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

  async createNotification(userId: number, data: NotificationPayload) {
    const settings = await this.getSettings(userId);
    if (!this.canReceiveNotification(settings, data.type)) {
      return null;
    }

    return this.prisma.notification.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async createForRoles(roles: Role[], data: NotificationPayload) {
    const users = await this.prisma.user.findMany({
      where: {
        role: { in: roles },
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
      select: { id: true },
    });

    return Promise.all(
      users.map((user) => this.createNotification(user.id, data)),
    );
  }

  private canReceiveNotification(settings: unknown, type: string) {
    const prefs = (settings || {}) as NotificationPreferences;

    switch (type) {
      case 'ORDER':
      case 'ORDER_STATUS':
        return prefs.orderStatus !== false;
      case 'PROMOTION':
        return prefs.promotions !== false;
      case 'SECURITY':
        return prefs.security !== false;
      default:
        return true;
    }
  }
}
