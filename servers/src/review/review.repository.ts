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

  async findByUserAndProduct(userId: number, productId: number): Promise<Review | null> {
    return this.prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async findByUserProductAndOrder(userId: number, productId: number, orderId: number): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: {
        userId_productId_orderId: { userId, productId, orderId },
      },
    });
  }

  async findById(id: number): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: 'DELIVERED',
          payment: { 
            status: 'SUCCESS' 
          },
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

  async hasUserPurchasedProductInOrder(userId: number, productId: number, orderId: number): Promise<boolean> {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          id: orderId,
          userId,
          status: 'DELIVERED',
          payment: { 
            status: 'SUCCESS' 
          },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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

  /**
   * Update a review
   */
  async update(id: number, data: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({
      where: { id },
      data,
      include: {
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

  /**
   * Delete a review
   */
  async delete(id: number): Promise<Review> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  /**
   * Get average rating and count for a product
   */
  async getProductRatingStats(productId: number) {
    return this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
  }

  /**
   * Update product rating statistics
   */
  async updateProductRating(productId: number, averageRating: number, reviewCount: number) {
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
}
