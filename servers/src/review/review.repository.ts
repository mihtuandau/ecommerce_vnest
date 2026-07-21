import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ReviewEntity,
  CreateReviewData,
  UpdateReviewData,
  ReviewFilter,
} from './review.types';

@Injectable()
export class ReviewRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReviewData): Promise<ReviewEntity> {
    return this.prisma.review.create({
      data: {
        user: { connect: { id: data.userId } },
        product: { connect: { id: data.productId } },
        order: { connect: { id: data.orderId } },
        rating: data.rating,
        comment: data.comment,
        images: { create: data.images.map((url) => ({ url })) },
      },
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
  ): Promise<ReviewEntity | null> {
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
  ): Promise<ReviewEntity | null> {
    return this.prisma.review.findUnique({
      where: {
        userId_productId_orderId: { userId, productId, orderId },
      },
    });
  }

  async findById(id: number): Promise<ReviewEntity | null> {
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

  async update(id: number, data: UpdateReviewData) {
    const { images, ...rest } = data;
    return this.prisma.review.update({
      where: { id },
      data: {
        ...rest,
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images.map((url) => ({ url })),
              },
            }
          : {}),
      },
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

  async delete(id: number): Promise<ReviewEntity> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  // Tính lại rating trực tiếp bằng subquery trong 1 câu UPDATE nguyên tử — tránh
  // lost-update khi nhiều review được tạo/sửa/xóa đồng thời (đọc số liệu ở tầng
  // app rồi ghi lại có thể bị ghi đè bởi request khác chạy song song).
  async recalculateProductRating(productId: number) {
    await this.prisma.$executeRaw`
      UPDATE "Product"
      SET "averageRating" = COALESCE(
            (SELECT AVG(rating) FROM "Review" WHERE "productId" = ${productId}),
            0
          ),
          "reviewCount" = (SELECT COUNT(*) FROM "Review" WHERE "productId" = ${productId})
      WHERE "id" = ${productId}
    `;
  }

  async findAll(filter: ReviewFilter, skip: number, take: number) {
    return this.prisma.review.findMany({
      where: filter,
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

  async count(filter: ReviewFilter): Promise<number> {
    return this.prisma.review.count({ where: filter });
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
