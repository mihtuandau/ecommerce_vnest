import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review, Prisma } from '@prisma/client';

@Injectable()
export class ReviewRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ReviewCreateInput): Promise<Review> {
    return this.prisma.review.create({
      data,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserAndProduct(
    userId: number,
    productId: number,
  ): Promise<Review | null> {
    return this.prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async findByUserProductAndOrder(
    userId: number,
    productId: number,
    orderId: number,
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: {
        userId_productId_orderId: { userId, productId, orderId },
      },
    });
  }

  async findById(id: number): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async hasUserPurchasedProduct(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: 'DELIVERED',
        },
        variant: {
          productId,
        },
      },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            payment: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (orderItem) {
      return true;
    }

    return false;
  }

  async hasUserPurchasedProductInOrder(
    userId: number,
    productId: number,
    orderId: number,
  ): Promise<boolean> {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          id: orderId,
          userId,
          status: 'DELIVERED',
        },
        variant: {
          productId,
        },
      },
    });

    return !!orderItem;
  }

  async findByProduct(productId: number, skip: number, take: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderCode: true,
            orderItems: {
              select: {
                variant: {
                  select: {
                    productId: true,
                    size: true,
                    color: true,
                  },
                },
                variantSnapshot: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countByProduct(productId: number): Promise<number> {
    return this.prisma.review.count({ where: { productId } });
  }

  async update(id: number, data: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({
      where: { id },
      data,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<Review> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async getProductRatingStats(productId: number) {
    return this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
  }

  async updateProductRating(
    productId: number,
    averageRating: number,
    reviewCount: number,
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount,
      },
    });
  }

  async findAll(where: Prisma.ReviewWhereInput, skip: number, take: number) {
    return this.prisma.review.findMany({
      where,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              select: {
                url: true,
                isThumbnail: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderCode: true,
            orderItems: {
              select: {
                variant: {
                  select: {
                    productId: true,
                    size: true,
                    color: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async count(where: Prisma.ReviewWhereInput): Promise<number> {
    return this.prisma.review.count({ where });
  }

  async findCommentsByProduct(productId: number) {
    return this.prisma.review.findMany({
      where: {
        productId,
        AND: [{ comment: { not: null } }, { comment: { not: '' } }],
      },
      select: {
        comment: true,
        rating: true,
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }
}
