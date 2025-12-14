import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
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
    const { productId, rating, comment, images } = dto;

    // Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await this.repository.hasUserPurchasedProduct(userId, productId);

    if (!hasPurchased) {
      throw new BadRequestException('Bạn cần mua sản phẩm này trước khi đánh giá');
    }

    // Kiểm tra đã review chưa
    const existingReview = await this.repository.findByUserAndProduct(userId, productId);

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi');
    }

    // Tạo review
    const review = await this.repository.create({
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      rating,
      comment,
      images: images || [],
    });

    // Cập nhật averageRating và reviewCount cho product
    await this.updateProductRating(productId);

    // Clear cache
    await this.cacheManager.del(`product:${productId}`);

    return review;
  }

  async canUserReview(userId: number, productId: number): Promise<boolean> {
    console.log('🔍 Checking if user can review:', { userId, productId });
    
    // Kiểm tra đã review chưa
    const existingReview = await this.repository.findByUserAndProduct(userId, productId);
    if (existingReview) {
      console.log('❌ User already reviewed this product');
      return false; // Đã review rồi
    }

    // Kiểm tra đã mua và nhận hàng chưa
    const hasPurchased = await this.repository.hasUserPurchasedProduct(userId, productId);
    console.log('✅ User has purchased product?', hasPurchased);
    return hasPurchased;
  }

  async getProductReviews(productId: number, page: number = 1, limit: number = 10) {
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

    const updated = await this.repository.update(reviewId, {
      ...(dto.rating && { rating: dto.rating }),
      ...(dto.comment !== undefined && { comment: dto.comment }),
      ...(dto.images && { images: dto.images }),
    });

    // Cập nhật rating của product
    await this.updateProductRating(review.productId);

    // Clear cache
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

    // Cập nhật rating của product
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product:${review.productId}`);

    return { message: 'Xóa đánh giá thành công' };
  }

  // Helper: Tính lại rating trung bình của product
  async updateProductRating(productId: number) {
    const result = await this.repository.getProductRatingStats(productId);

    await this.repository.updateProductRating(
      productId,
      result._avg.rating || 0,
      result._count || 0,
    );
  }

  // Admin: Get all reviews with filters
  async getAllReviews(page: number = 1, limit: number = 20, productId?: number) {
    const skip = (page - 1) * limit;

    const where = productId ? { productId } : {};

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
