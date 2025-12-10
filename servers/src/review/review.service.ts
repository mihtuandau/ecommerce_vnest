import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createReview(userId: number, dto: CreateReviewDto) {
    const { productId, rating, comment, images } = dto;

    // Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: 'DELIVERED', // Chỉ cho review nếu đã nhận hàng
        },
        variant: {
          productId,
        },
      },
    });

    if (!hasPurchased) {
      throw new BadRequestException('Bạn cần mua sản phẩm này trước khi đánh giá');
    }

    // Kiểm tra đã review chưa
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi');
    }

    // Tạo review
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        images: images || [],
      },
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

    // Cập nhật averageRating và reviewCount cho product
    await this.updateProductRating(productId);

    // Clear cache
    await this.cacheManager.del(`product:${productId}`);

    return review;
  }

  async canUserReview(userId: number, productId: number): Promise<boolean> {
    // Kiểm tra đã review chưa
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      return false; // Đã review rồi
    }

    // Kiểm tra đã mua và nhận hàng chưa
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: 'DELIVERED', // Chỉ cho review nếu đã nhận hàng
        },
        variant: {
          productId,
        },
      },
    });

    return !!hasPurchased;
  }

  async getProductReviews(productId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
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
        take: limit,
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền sửa đánh giá này');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating && { rating: dto.rating }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
        ...(dto.images && { images: dto.images }),
      },
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

    // Cập nhật rating của product
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product:${review.productId}`);

    return updated;
  }

  async deleteReview(reviewId: number, userId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền xóa đánh giá này');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Cập nhật rating của product
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product:${review.productId}`);

    return { message: 'Xóa đánh giá thành công' };
  }

  // Helper: Tính lại rating trung bình của product
  async updateProductRating(productId: number) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        reviewCount: result._count || 0,
      },
    });
  }

  // Admin: Get all reviews with filters
  async getAllReviews(page: number = 1, limit: number = 20, productId?: number) {
    const skip = (page - 1) * limit;

    const where = productId ? { productId } : {};

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
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
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
