import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus, Prisma } from '@prisma/client';

/**
 * Repository pattern for Order data access
 * Handles all database queries related to orders
 */
@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new order
   */
  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true, images: true },
            },
          },
        },
        payment: true,
        user: true,
      },
    });
  }

  /**
   * Find order by unique code
   */
  async findByCode(orderCode: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderCode },
    });
  }

  /**
   * Find order by ID with relations
   */
  async findById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { 
                product: { 
                  include: { 
                    images: { 
                      select: { 
                        url: true 
                      } 
                    } 
                  } 
                }, 
                images: { 
                  select: { 
                    url: true 
                  } 
                }
              },
            },
          },
        },
        user: true,
        payment: true,
        address: true,
      },
    });
  }

  /**
   * Find all orders with filters
   */
  async findAll(where: Prisma.OrderWhereInput, skip: number, take: number) {
    return this.prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        payment: true, // Include payment info for admin
        orderItems: {
          include: {
            variant: {
              include: { 
                product: { 
                  select: { 
                    id: true,
                    name: true,
                    images: { 
                      select: { 
                        url: true 
                      },
                      take: 1 
                    } 
                  } 
                } 
              },
            },
          },
        },
      },
    });
  }

  /**
   * Count orders with filters
   */
  async count(where: Prisma.OrderWhereInput): Promise<number> {
    return this.prisma.order.count({ where });
  }

  /**
   * Update order
   */
  async update(id: number, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        orderItems: {
          include: {
            variant: { include: { product: true } },
          },
        },
        user: true,
      },
    });
  }

  /**
   * Delete order
   */
  async delete(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  /**
   * Find product variants by IDs
   */
  async findVariantsByIds(variantIds: number[]) {
    return this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    });
  }

  /**
   * Find discount by code
   */
  async findDiscountByCode(code: string) {
    return this.prisma.discount.findUnique({
      where: { code },
    });
  }

  /**
   * Clear user cart
   */
  async clearUserCart(userId: number): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    });
  }

  /**
   * Find guest order by code and contact
   */
  async findGuestOrder(orderCode: string, contact: string) {
    return this.prisma.order.findFirst({
      where: {
        orderCode,
        OR: [{ guestEmail: contact }, { guestPhone: contact }],
        userId: null,
      },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true, images: true },
            },
          },
        },
        payment: true,
      },
    });
  }

  /**
   * Apply discount to order
   */
  async applyDiscount(orderId: number, discountId: number) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { discountId },
      include: {
        discount: true,
        orderItems: true,
      },
    });
  }

  /**
   * Increment product sold count
   */
  async incrementProductSoldCount(productId: number, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        soldCount: {
          increment: quantity,
        },
      },
    });
  }
}
