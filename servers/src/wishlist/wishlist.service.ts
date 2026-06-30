import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(userId: number, variantId: number) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });

    if (existing) {
      return this.prisma.wishlistItem.findUnique({
        where: { id: existing.id },
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

    return this.prisma.wishlistItem.create({
      data: {
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
