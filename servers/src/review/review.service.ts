  import {
    Injectable,
    BadRequestException,
    NotFoundException,
    Inject,
  } from '@nestjs/common';
  import { CACHE_MANAGER } from '@nestjs/cache-manager';
  import type { Cache } from 'cache-manager';
  import { ReviewRepository } from './review.repository';
  import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

  @Injectable()
  export class ReviewService {
    constructor(
      private repository: ReviewRepository,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async createReview(userId: number, dto: CreateReviewDto) {
      const { productId, orderId, rating, comment, images } = dto;

      const hasPurchased = await this.repository.hasUserPurchasedProductInOrder(
        userId,
        productId,
        orderId,
      );

      if (!hasPurchased) {
        throw new BadRequestException(
          'Bạn cần mua sản phẩm này trong đơn hàng để đánh giá',
        );
      }

      const existingReview = await this.repository.findByUserProductAndOrder(
        userId,
        productId,
        orderId,
      );

      if (existingReview) {
        throw new BadRequestException(
          'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi',
        );
      }

      // Validate review images
      const validatedImages = await this.validateReviewImages(images || []);

      // Sanitize comment to prevent XSS
      const sanitizedComment = comment ? require('sanitize-html')(comment, {
        allowedTags: [], // Strip all tags for simple reviews
        allowedAttributes: {},
      }) : null;

      const review = await this.repository.create({
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        order: { connect: { id: orderId } },
        rating,
        comment: sanitizedComment,
        images: validatedImages,
      });

      await this.updateProductRating(productId);

      await this.cacheManager.del(`product:${productId}`);

      return review;
    }

    private async validateReviewImages(images: any[]): Promise<string[]> {
      if (!images || !Array.isArray(images) || images.length === 0) return [];

      // Max 5 images
      if (images.length > 5) {
        throw new BadRequestException('Tối đa 5 hình ảnh cho một đánh giá');
      }

      for (const image of images) {
        if (typeof image !== 'string') {
          throw new BadRequestException('Định dạng ảnh không hợp lệ. Vui lòng tải lại trang và thử lại.');
        }
      }

      return images;
    }

    async canUserReview(
      userId: number,
      productId: number,
      orderId: number,
    ): Promise<{
      canReview: boolean;
      reason?: string;
      hasReviewed?: boolean;
      hasPurchased?: boolean;
    }> {
      const existingReview = await this.repository.findByUserProductAndOrder(
        userId,
        productId,
        orderId,
      );

      if (existingReview) {
        return {
          canReview: false,
          reason: 'already_reviewed',
          hasReviewed: true,
          hasPurchased: true,
        };
      }

      const hasPurchased = await this.repository.hasUserPurchasedProductInOrder(
        userId,
        productId,
        orderId,
      );

      if (!hasPurchased) {
        return {
          canReview: false,
          reason: 'not_purchased',
          hasReviewed: false,
          hasPurchased: false,
        };
      }

      return {
        canReview: true,
        hasReviewed: false,
        hasPurchased: true,
      };
    }

    async getUserProductReview(
      userId: number,
      productId: number,
      orderId: number,
    ) {
      const review = await this.repository.findByUserProductAndOrder(
        userId,
        productId,
        orderId,
      );
      if (review) {
        return {
          exists: true,
          review: {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
          },
        };
      }
      return { exists: false, review: null };
    }

    async getMyReviews(userId: number, page: number = 1, limit: number = 10) {
      const skip = (page - 1) * limit;
      const where = { userId };

      const [reviews, total] = await Promise.all([
        this.repository.findAll(where, skip, limit),
        this.repository.count(where),
      ]);

      return {
        reviews,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }

    async getProductReviews(
      productId: number,
      page: number = 1,
      limit: number = 10,
    ) {
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.repository.findByProduct(productId, skip, limit),
        this.repository.countByProduct(productId),
      ]);

      return {
        reviews,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }

    async updateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
      const review = await this.repository.findById(reviewId);

      if (!review) {
        throw new NotFoundException('Không tìm thấy đánh giá');
      }

      if (review.userId !== userId) {
        throw new BadRequestException('Bạn không có quyền sửa đánh giá này');
      }

      const sanitizedComment = dto.comment !== undefined ? (dto.comment ? require('sanitize-html')(dto.comment, {
        allowedTags: [],
        allowedAttributes: {},
      }) : null) : undefined;

      const updated = await this.repository.update(reviewId, {
        ...(dto.rating && { rating: dto.rating }),
        ...(sanitizedComment !== undefined && { comment: sanitizedComment }),
        ...(dto.images && { images: dto.images }),
      });

      await this.updateProductRating(review.productId);

      await this.cacheManager.del(`product:${review.productId}`);

      return updated;
    }

    async deleteReview(reviewId: number, userId: number) {
      const review = await this.repository.findById(reviewId);

      if (!review) {
        throw new NotFoundException('Không tìm thấy đánh giá');
      }

      if (review.userId !== userId) {
        throw new BadRequestException('Bạn không có quyền xóa đánh giá này');
      }

      await this.repository.delete(reviewId);

      await this.updateProductRating(review.productId);

      await this.cacheManager.del(`product:${review.productId}`);

      return { message: 'Xóa đánh giá thành công' };
    }

    async updateProductRating(productId: number) {
      const result = await this.repository.getProductRatingStats(productId);

      await this.repository.updateProductRating(
        productId,
        result._avg.rating || 0,
        result._count || 0,
      );
    }

    async getAllReviews(
      page: number = 1,
      limit: number = 20,
      productId?: number,
      userId?: number,
    ) {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (productId) where.productId = productId;
      if (userId) where.userId = userId;

      const [reviews, total] = await Promise.all([
        this.repository.findAll(where, skip, limit),
        this.repository.count(where),
      ]);

      return {
        reviews,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }
  }






