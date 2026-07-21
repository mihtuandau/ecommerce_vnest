import { Discount } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type DiscountEntity = Discount;

export interface CreateDiscountData {
  code: string;
  description?: string;
  image?: string;
  isFlashSale?: boolean;
  isActive?: boolean;
  percentage?: number;
  fixedAmount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startDate: Date;
  endDate?: Date | null;
  applicableToProductIds?: number[];
}

export type UpdateDiscountData = Partial<CreateDiscountData>;

// findAll/countWithFilter accept a broad, dynamically-built search filter
// (OR/AND groups, contains/insensitive search, date range comparisons) —
// kept intentionally loose rather than reinventing Prisma's WhereInput
// one field at a time, but no longer named/imported as a Prisma type at
// the repository boundary.
export type DiscountFilter = Record<string, any>;
