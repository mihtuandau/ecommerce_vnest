import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { createClient } from 'redis';
import sanitizeHtml from 'sanitize-html';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ReviewService implements OnModuleInit {
  private redisClient: any;
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private repository: ReviewRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private uploadService: UploadService,
  ) {}

  async onModuleInit() {
    try {
      this.redisClient = createClient({
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      });
      await this.redisClient.connect();
    } catch (err) {
      this.logger.warn(
        'Redis client không khả dụng cho cache wildcard deletion',
      );
    }
  }

  /**
   * Xóa tất cả cache danh sách sản phẩm khi rating/reviewCount thay đổi.
   * Đảm bảo trang "Tất cả sản phẩm" hiển thị dữ liệu mới nhất.
   */
  private async clearProductListCaches(productId: number) {
    try {
      // Xóa cache sản phẩm đơn lẻ
      await this.cacheManager.del(`product:${productId}`);

      // Xóa tất cả cache danh sách sản phẩm (wildcard) bằng SCAN để không làm chậm server
      if (this.redisClient && typeof this.redisClient.scan === 'function') {
        let cursor = 0;
        const pattern = '*products*';
        do {
          // Cú pháp mới cho node-redis v4/v5
          const reply = await this.redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
          });

          cursor = reply.cursor;
          const keys = reply.keys;

          if (keys && keys.length > 0) {
            await this.redisClient.del(keys);
          }
        } while (cursor !== 0);
        this.logger.debug(`Đã hoàn tất dọn dẹp cache wildcard cho products`);
      } else {
        // Fallback nếu không có redisClient trực tiếp
        await this.cacheManager.del('products:all');
      }
    } catch (err) {
      this.logger.warn(`Lỗi khi xóa product list caches: ${err.message}`);
    }
  }

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
    const sanitizedComment = comment
      ? sanitizeHtml(comment, {
          allowedTags: [], // Strip all tags for simple reviews
          allowedAttributes: {},
        })
      : null;

    const review = await this.repository.create({
      userId,
      productId,
      orderId,
      rating,
      comment: sanitizedComment,
      images: validatedImages,
    });

    await this.updateProductRating(productId);

    await this.clearProductListCaches(productId);

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
        throw new BadRequestException(
          'Định dạng ảnh không hợp lệ. Vui lòng tải lại trang và thử lại.',
        );
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

    const sanitizedComment =
      dto.comment !== undefined
        ? dto.comment
          ? sanitizeHtml(dto.comment, {
              allowedTags: [],
              allowedAttributes: {},
            })
          : null
        : undefined;

    const updated = await this.repository.update(reviewId, {
      ...(dto.rating && { rating: dto.rating }),
      ...(sanitizedComment !== undefined && { comment: sanitizedComment }),
      ...(dto.images && { images: dto.images }),
    });

    await this.updateProductRating(review.productId);

    await this.clearProductListCaches(review.productId);

    // Dọn ảnh cũ khỏi Cloudinary khi review đổi bộ ảnh, tránh rác storage tích
    // lũy theo thời gian. Best-effort — không chặn response nếu xóa lỗi.
    if (dto.images) {
      const oldUrls: string[] = ((review as any).images || []).map(
        (img: any) => img.url,
      );
      const newUrls = new Set(dto.images);
      const removedUrls = oldUrls.filter((url) => !newUrls.has(url));
      await Promise.allSettled(
        removedUrls.map((url) => this.uploadService.deleteImage(url)),
      );
    }

    return updated;
  }

  async deleteReview(reviewId: number, userOrId: number | any) {
    const review = await this.repository.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    let canDelete = false;

    if (typeof userOrId === 'number') {
      canDelete = review.userId === userOrId;
    } else if (userOrId && typeof userOrId === 'object') {
      const userId = userOrId.userId || userOrId.id;
      const role = userOrId.role;
      const permissions = userOrId.permissions || [];

      const isAdmin =
        role === 'ADMIN' ||
        permissions.includes('product.manage') ||
        permissions.includes('settings.manage');
      canDelete = isAdmin || review.userId === userId;
    }

    if (!canDelete) {
      throw new BadRequestException('Bạn không có quyền xóa đánh giá này');
    }

    await this.repository.delete(reviewId);

    await this.updateProductRating(review.productId);

    await this.clearProductListCaches(review.productId);

    // Dọn ảnh khỏi Cloudinary khi xóa review, tránh rác storage. Best-effort.
    const urls: string[] = ((review as any).images || []).map(
      (img: any) => img.url,
    );
    await Promise.allSettled(
      urls.map((url) => this.uploadService.deleteImage(url)),
    );

    return { message: 'Xóa đánh giá thành công' };
  }

  async updateProductRating(productId: number) {
    await this.repository.recalculateProductRating(productId);
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
