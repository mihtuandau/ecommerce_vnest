import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  private baseInclude = {
    orderItems: { include: { variant: { include: { product: { include: { images: { select: { url: true }, take: 1 } } }, images: { select: { url: true } } } } } },
    user: { select: { id: true, email: true, name: true } }, payment: true, address: true, shippingMethod: true,
    returnRequests: { include: { returnItems: true } },
    reviews: { select: { productId: true } }
  };

  async create(data: Prisma.OrderCreateInput) { return this.prisma.order.create({ data, include: this.baseInclude }); }
  async findByCode(orderCode: string) { return this.prisma.order.findUnique({ where: { orderCode }, include: this.baseInclude }); }
  async findById(id: number) { return this.prisma.order.findUnique({ where: { id }, include: this.baseInclude }); }
  async findAll(where: Prisma.OrderWhereInput, skip: number, take: number) { return this.prisma.order.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: this.baseInclude }); }
  async count(where: Prisma.OrderWhereInput) { return this.prisma.order.count({ where }); }
  async update(id: number, data: Prisma.OrderUpdateInput) { return this.prisma.order.update({ where: { id }, data, include: this.baseInclude }); }
  async delete(id: number) { return this.prisma.order.delete({ where: { id } }); }

  async findAutoApplyPricesForVariants(vIds: number[]) {
    const now = new Date();
    const variants = await this.prisma.productVariant.findMany({ where: { id: { in: vIds } }, include: { product: { select: { categoryId: true } } } });
    const discounts = await this.prisma.discount.findMany({
      where: { isActive: true, startDate: { lte: now }, AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }, { OR: [{ code: "" }, { isFlashSale: true }] }] },
      include: { applicableToProducts: true, applicableToCategories: true }, orderBy: [{ percentage: 'desc' }, { fixedAmount: 'desc' }]
    });
    const result = new Map<number, number>();
    for (const v of variants) {
      const best = discounts.find(d => !d.applicableToProducts.length && !d.applicableToCategories.length || d.applicableToProducts.some(ap => ap.productId === v.productId) || d.applicableToCategories.some(ac => ac.categoryId === v.product.categoryId));
      if (best) {
        const p = best.percentage ? Math.round(v.price * (1 - best.percentage / 100)) : Math.max(0, v.price - (best.fixedAmount || 0));
        if (p < v.price) result.set(v.id, p);
      }
    }
    return result;
  }

  async findDiscountByCode(code: string) { return this.prisma.discount.findUnique({ where: { code: code.toUpperCase() } }); }
  async countOrdersUsingDiscount(discountId: number) { return this.prisma.order.count({ where: { discountId, status: { not: 'CANCELLED' as any } } }); }
  async findGuestOrderByCodeAndContact(code: string, contact: string) { return this.prisma.order.findFirst({ where: { orderCode: code, OR: [{ guestEmail: contact }, { guestPhone: contact }], userId: null }, include: this.baseInclude }); }
  async incrementProductSoldCount(productId: number, quantity: number) { return this.prisma.product.update({ where: { id: productId }, data: { soldCount: { increment: quantity } } }); }
  async decrementProductSoldCount(productId: number, quantity: number) { return this.prisma.product.update({ where: { id: productId }, data: { soldCount: { decrement: quantity } } }); }
  async clearUserCart(userId: number) { await this.prisma.cartItem.deleteMany({ where: { cart: { userId } } }); }

  async createOrderTransactional(orderData: Prisma.OrderCreateInput, items: any[], discountId?: number, discountUsageLimit?: number) {
    return this.prisma.$transaction(async (tx) => {
      const userId = (orderData.user as any)?.connect?.id;
      console.log(`[OrderRepository] Processing order for userId: ${userId}, discountId: ${discountId}`);

      // Validate discount usage within transaction (prevents race condition)
      if (discountId) {
        // 1. Check global usage limit
        if (discountUsageLimit) {
          const currentUsageCount = await tx.order.count({
            where: {
              discountId,
              status: { not: 'CANCELLED' as any }
            }
          });
          console.log(`[OrderRepository] Global usage count for discount ${discountId}: ${currentUsageCount}/${discountUsageLimit}`);
          
          if (currentUsageCount >= discountUsageLimit) {
            throw new Error('Mã giảm giá đã hết lượt sử dụng');
          }
        }

        // 2. Check per-user usage limit (Each user can use a specific discount only once)
        if (userId) {
          const userUsage = await tx.discountUsage.findUnique({
            where: {
              userId_discountId: {
                userId,
                discountId,
              },
            },
          });
          console.log(`[OrderRepository] Per-user usage check for user ${userId}, discount ${discountId}: ${userUsage ? 'ALREADY USED' : 'NOT USED'}`);
          if (userUsage) {
            throw new Error('Bạn đã sử dụng mã giảm giá này rồi');
          }
        }
      }

      for (const item of items) {
        // Atomic conditional update: chỉ trừ stock khi stock >= quantity
        const result = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new Error('Sản phẩm hết hàng hoặc không đủ số lượng');
        }

        // Increment soldCount if the order is already DELIVERED
        if (orderData.status === 'DELIVERED') {
          await tx.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } }
          });
        }
      }

      const order = await tx.order.create({ data: orderData, include: this.baseInclude });

      // 3. Record user discount usage if applicable
      if (discountId && userId) {
        await tx.discountUsage.create({
          data: {
            userId,
            discountId,
            orderId: order.id
          }
        });
      }

      return order;
    });
  }

  async restoreOrderStock(id: number, wasSold: boolean = false) {
    const o = await this.prisma.order.findUnique({ 
      where: { id }, 
      select: { 
        orderItems: { 
          select: { 
            variantId: true, 
            quantity: true,
            variant: { select: { productId: true } }
          } 
        } 
      } 
    });

    if (o && o.orderItems.length > 0) {
      console.log(`[OrderRepository] Restoring stock for ${o.orderItems.length} items of order ${id}. wasSold: ${wasSold}`);
      
      await this.prisma.$transaction(async (tx) => {
        for (const item of o.orderItems) {
          // 1. Hoàn tồn kho
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } }
          });
          
          // 2. Trừ soldCount nếu đơn đã được tính là thành công trước đó
          if (wasSold) {
            await tx.product.update({
              where: { id: item.variant.productId },
              data: { soldCount: { decrement: item.quantity } }
            });
          }
        }
      });
      
      console.log(`[OrderRepository] Stock restoration completed for order ${id}`);
    } else {
      console.log(`[OrderRepository] No items found to restore stock for order ${id}`);
    }
  }

  async hasUserUsedDiscount(userId: number, discountId: number): Promise<boolean> {
    const count = await this.prisma.discountUsage.count({
      where: {
        userId,
        discountId,
      },
    });
    return count > 0;
  }

  async restoreDiscountUsage(orderId: number) {
    await this.prisma.discountUsage.deleteMany({
      where: {
        orderId,
      },
    });
  }

  async findAbandonedOrders(createdBefore: Date) {
    return this.prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: createdBefore },
        // Chỉ xử lý các đơn thanh toán Online vì COD thường được duyệt thủ công
        paymentMethod: { in: ['VNPAY', 'PAYOS'] }
      },
      include: {
        payment: true
      }
    });
  }
}
