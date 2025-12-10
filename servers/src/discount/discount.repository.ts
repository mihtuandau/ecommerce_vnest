import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Discount, Prisma } from '@prisma/client';

/**
 * Repository pattern for Discount data access
 * Handles all database queries related to discounts
 */
@Injectable()
export class DiscountRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new discount
   */
  async create(data: Prisma.DiscountCreateInput): Promise<Discount> {
    return this.prisma.discount.create({ data });
  }

  /**
   * Find discount by code
   */
  async findByCode(code: string): Promise<Discount | null> {
    return this.prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Find discount by ID
   */
  async findById(id: number) {
    return this.prisma.discount.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  /**
   * Find all discounts with filters
   */
  async findAll(where: Prisma.DiscountWhereInput) {
    return this.prisma.discount.findMany({
      where,
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update discount
   */
  async update(id: number, data: Prisma.DiscountUpdateInput): Promise<Discount> {
    return this.prisma.discount.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete discount
   */
  async delete(id: number): Promise<Discount> {
    return this.prisma.discount.delete({
      where: { id },
    });
  }

  /**
   * Count orders using discount
   */
  async countOrdersUsingDiscount(discountId: number): Promise<number> {
    return this.prisma.order.count({
      where: { discountId },
    });
  }

  /**
   * Count total discounts
   */
  async count(): Promise<number> {
    return this.prisma.discount.count();
  }

  /**
   * Count discounts with filter
   */
  async countWithFilter(where: Prisma.DiscountWhereInput): Promise<number> {
    return this.prisma.discount.count({ where });
  }
}
