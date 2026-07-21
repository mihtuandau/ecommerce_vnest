import { Review } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type ReviewEntity = Review;

export interface CreateReviewData {
  userId: number;
  productId: number;
  orderId: number;
  rating: number;
  comment: string | null;
  images: string[];
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string | null;
  images?: string[];
}

export interface ReviewFilter {
  userId?: number;
  productId?: number;
}
