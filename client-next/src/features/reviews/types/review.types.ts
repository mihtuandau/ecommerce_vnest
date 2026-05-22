export interface CreateReviewPayload {
  productId: number;
  orderId?: number;
  rating: number;
  comment: string;
  images?: string[];
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  productId?: number;
  userId?: number;
}

export interface MyReviewsQueryParams {
  page?: number;
  limit?: number;
}
