import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(userId: number, variantId: number) {
    // Dùng upsert thay vì check-then-create: 2 request thêm cùng 1 variant gần
    // như đồng thời trước đây có thể cùng vượt qua bước findUnique rồi cùng
    // create → vi phạm unique constraint và trả lỗi 500 thay vì xử lý êm.
    return this.prisma.wishlistItem.upsert({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
      update: {},
      create: {
        userId,
        variantId,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
            images: true,
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: number, variantId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: {
        userId,
        variantId,
      },
    });
  }

  async getWishlist(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isInWishlist(userId: number, variantId: number) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });
    return !!item;
  }

  async clearWishlist(userId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });
  }

  async getCount(userId: number): Promise<number> {
    return this.prisma.wishlistItem.count({ where: { userId } });
  }
}
