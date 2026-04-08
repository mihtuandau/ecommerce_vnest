import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

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
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
      },
    });
  }

  /**
   * Find order by unique code
   */
  async findByCode(orderCode: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderCode },
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
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        payment: true,
        address: true,
      },
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
   * Tính giá sau auto-apply discount (flash sale / per-product) cho từng variantId.
   * Trả về Map<variantId, giá đã giảm> — chỉ chứa những variant CÓ discount.
   */
  async findAutoApplyPricesForVariants(variantIds: number[]): Promise<Map<number, number>> {
    const now = new Date();

    // Lấy productId + price cho từng variant
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, productId: true, price: true },
    });

    const productIds = [...new Set(variants.map((v) => v.productId))];

    // Lấy tất cả discount active có applicableToProducts
    const discounts = await this.prisma.discount.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      select: {
        percentage: true,
        fixedAmount: true,
        isFlashSale: true,
        applicableToProducts: true,
      },
      orderBy: [
        { percentage: 'desc' },   // % giảm cao nhất ưu tiên trước
        { fixedAmount: 'desc' },  // rồi đến giảm tiền cố định cao nhất
        { isFlashSale: 'desc' },  // flash sale làm tiebreaker nếu ngang nhau
      ],
    });

    // productId → discount tốt nhất (first-win do đã sort)
    const productDiscountMap = new Map<number, { percentage: number | null; fixedAmount: number | null }>();
    for (const d of discounts) {
      // applicableToProducts is now an array of DiscountProduct objects, extract productId
      for (const discountProduct of d.applicableToProducts) {
        const pid = discountProduct.productId;
        if (productIds.includes(pid) && !productDiscountMap.has(pid)) {
          productDiscountMap.set(pid, {
            percentage: d.percentage,
            fixedAmount: d.fixedAmount,
          });
        }
      }
    }

    // variantId → giá sau giảm
    const result = new Map<number, number>();
    for (const v of variants) {
      const d = productDiscountMap.get(v.productId);
      if (!d) continue;
      let discountedPrice = v.price;
      if (d.percentage) {
        discountedPrice = Math.round(v.price * (1 - d.percentage / 100));
      } else if (d.fixedAmount) {
        discountedPrice = Math.max(0, v.price - d.fixedAmount);
      }
      result.set(v.id, discountedPrice);
    }

    return result;
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
   * Alias for findGuestOrder - used by cancel functionality
   */
  async findGuestOrderByCodeAndContact(orderCode: string, contact: string) {
    return this.findGuestOrder(orderCode, contact);
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
   * Increment product sold count - with safety check
   */
  async incrementProductSoldCount(productId: number, quantity: number) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: { soldCount: { increment: quantity } },
      select: { id: true, name: true, soldCount: true },
    });
  }

  /**
   * Create order with atomic stock check + decrement (prevents overselling)
   */
  async createOrderTransactional(
    orderData: Prisma.OrderCreateInput,
    items: Array<{ variantId: number; quantity: number }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Check stock for all items atomically inside transaction
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { id: true, stock: true, isActive: true },
        });
        if (!variant || !variant.isActive) {
          throw new Error(
            `Sản phẩm ID ${item.variantId} không tồn tại hoặc đã ngừng kinh doanh`,
          );
        }
        if (variant.stock < item.quantity) {
          throw new Error(
            `Sản phẩm ID ${item.variantId} không đủ hàng (còn ${variant.stock}, cần ${item.quantity})`,
          );
        }
      }

      // 2. Decrement stock for all items (reserve inventory)
      await Promise.all(
        items.map((item) =>
          tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // 3. Create order
      return tx.order.create({
        data: orderData,
        include: {
          orderItems: {
            include: {
              variant: { include: { product: true, images: true } },
            },
          },
          payment: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });
    });
  }

  /**
   * Restore stock when order is cancelled
   */
  async restoreOrderStock(orderId: number): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { orderItems: { select: { variantId: true, quantity: true } } },
    });
    if (!order || !order.orderItems.length) return;
    await this.prisma.$transaction(
      order.orderItems.map((item) =>
        this.prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );
  }
}
