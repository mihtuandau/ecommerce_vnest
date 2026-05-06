import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  private baseInclude = {
    orderItems: { 
      include: { 
        variant: { 
          include: { 
            product: { include: { images: { select: { url: true }, take: 1 } } }, 
            images: { select: { url: true } } 
          } 
        },
        returnItems: {
          include: {
            returnRequest: true
          }
        }
      } 
    },
    user: { select: { id: true, email: true, name: true } }, 
    payment: true, 
    address: true, 
    shippingMethod: true,
    returnRequests: { include: { returnItems: true } },
    reviews: { select: { productId: true } }
  };

  async create(data: Prisma.OrderCreateInput) { return this.prisma.order.create({ data, include: this.baseInclude }); }
  async findByCode(orderCode: string) { return this.prisma.order.findUnique({ where: { orderCode }, include: this.baseInclude }); }
  async findById(id: number) { return this.prisma.order.findUnique({ where: { id }, include: this.baseInclude }); }
  async findByShippingCode(shippingCode: string) { return this.prisma.order.findFirst({ where: { shippingCode }, include: this.baseInclude }); }
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
  async decrementProductSoldCount(productId: number, quantity: number) { return this.prisma.$executeRaw`UPDATE "Product" SET "soldCount" = GREATEST(0, "soldCount" - ${quantity}) WHERE "id" = ${productId}`; }
  async clearUserCart(userId: number) { await this.prisma.cartItem.deleteMany({ where: { cart: { userId } } }); }

  async createOrderTransactional(orderData: Prisma.OrderCreateInput, items: any[], discountId?: number, discountUsageLimit?: number) {
    return this.prisma.$transaction(async (tx) => {
      const userId = (orderData.user as any)?.connect?.id;
      console.log(`[OrderRepository] Processing order for userId: ${userId}, discountId: ${discountId}`);

      // Validate discount usage within transaction (prevents race condition)
      if (discountId) {
        // 1. Check global usage limit
        if (discountUsageLimit) {
          // Atomic increment with condition: only update if usageCount < limit
          const updateResult = await tx.discount.updateMany({
            where: { 
              id: discountId,
              usageCount: { lt: discountUsageLimit }
            },
            data: { usageCount: { increment: 1 } }
          });
          
          if (updateResult.count === 0) {
            throw new Error('Mã giảm giá đã hết lượt sử dụng');
          }
        } else {
          // Atomic increment for cached count without limit
          await tx.discount.update({
            where: { id: discountId },
            data: { usageCount: { increment: 1 } }
          });
        }

        // 2. Check per-user/guest usage limit
        const OR_conditions: any[] = [];
        if (userId) OR_conditions.push({ userId });
        if (orderData.guestEmail) OR_conditions.push({ guestEmail: orderData.guestEmail });
        if (orderData.guestPhone) OR_conditions.push({ guestPhone: orderData.guestPhone });

        if (OR_conditions.length > 0) {
          const userUsage = await tx.discountUsage.findFirst({
            where: {
              discountId,
              OR: OR_conditions,
            },
          });
          console.log(`[OrderRepository] Per-user/guest usage check for discount ${discountId}: ${userUsage ? 'ALREADY USED' : 'NOT USED'}`);
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
            deletedAt: null,
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

      // 3. Record user/guest discount usage if applicable
      //    DB có partial unique index trên (userId, discountId), (guestEmail, discountId),
      //    (guestPhone, discountId) → chống race condition. Bắt P2002 để báo lỗi rõ ràng.
      if (discountId) {
        if (userId || orderData.guestEmail || orderData.guestPhone) {
          try {
            await tx.discountUsage.create({
              data: {
                userId,
                guestEmail: orderData.guestEmail,
                guestPhone: orderData.guestPhone,
                discountId,
                orderId: order.id
              }
            });
          } catch (e: any) {
            if (e?.code === 'P2002') {
              throw new Error('Bạn đã sử dụng mã giảm giá này rồi');
            }
            throw e;
          }
        }
      }

      return order;
    });
  }

  async hasUsedDiscount(userId: number | null, discountId: number, guestEmail?: string | null, guestPhone?: string | null): Promise<boolean> {
    const OR_conditions: any[] = [];
    if (userId) OR_conditions.push({ userId });
    if (guestEmail) OR_conditions.push({ guestEmail });
    if (guestPhone) OR_conditions.push({ guestPhone });

    if (OR_conditions.length === 0) return false;

    const count = await this.prisma.discountUsage.count({
      where: {
        discountId,
        OR: OR_conditions,
      },
    });
    return count > 0;
  }

  async restoreDiscountUsage(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { discountId: true }
    });

    if (order?.discountId) {
      await this.prisma.$executeRaw`UPDATE "Discount" SET "usageCount" = GREATEST(0, "usageCount" - 1) WHERE "id" = ${order.discountId}`;
    }

    await this.prisma.discountUsage.deleteMany({
      where: {
        orderId,
      },
    });
  }

  async restoreOrderStock(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              returnItems: {
                include: { returnRequest: true }
              }
            }
          }
        }
      });

      if (!order) return;

      for (const item of order.orderItems) {
        // Tính tổng số lượng đã được trả về kho qua hệ thống Return (trạng thái RECEIVED hoặc COMPLETED)
        const alreadyRestored = item.returnItems?.reduce((sum: number, ri: any) => {
          const status = ri.returnRequest?.status;
          return (status === 'RECEIVED' || status === 'COMPLETED') ? sum + ri.quantity : sum;
        }, 0) || 0;

        const quantityToRestore = item.quantity - alreadyRestored;

        if (quantityToRestore > 0) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: quantityToRestore } }
          });
          console.log(`[OrderRepository] Restored ${quantityToRestore} stock for variant ${item.variantId} (Order #${id})`);
        }
      }
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

  async cancelAndRestore(id: number, paymentId?: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get order with return items
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              returnItems: { include: { returnRequest: true } }
            }
          }
        }
      });

      if (!order) throw new Error('Order not found');
      
      // Prevent double-restoration if already cancelled
      if (order.status === 'CANCELLED') {
        return null;
      }

      // 2. Update order status with concurrency guard: only update if not already changed
      const updateResult = await tx.order.updateMany({
        where: { id, status: order.status },
        data: { status: 'CANCELLED' }
      });

      if (updateResult.count === 0) {
        return null; // Another process (like manual admin cancel) already changed this order!
      }

      // 3. Restore stock (Partial return aware)
      for (const item of order.orderItems) {
        const alreadyRestored = item.returnItems?.reduce((sum: number, ri: any) => {
          const status = ri.returnRequest?.status;
          return (status === 'RECEIVED' || status === 'COMPLETED') ? sum + ri.quantity : sum;
        }, 0) || 0;

        const quantityToRestore = item.quantity - alreadyRestored;

        if (quantityToRestore > 0) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: quantityToRestore } }
          });
        }
      }

      // 4. Restore discount usage (Atomic decrement + usage record deletion)
      //    Lấy discountId trực tiếp từ Order, độc lập với việc có DiscountUsage record hay không.
      //    (DiscountUsage chỉ được tạo khi có userId/guestEmail/guestPhone; nếu không có
      //     thì usageCount vẫn đã được increment nên cần decrement khi hủy.)
      if (order.discountId) {
        await tx.$executeRaw`UPDATE "Discount" SET "usageCount" = GREATEST(0, "usageCount" - 1) WHERE "id" = ${order.discountId}`;
        await tx.discountUsage.deleteMany({
          where: { orderId: id }
        });
        console.log(`[OrderRepository] Restored discount usage for ${order.discountId} (Order #${id})`);
      }

      // 5. Update payment status if provided
      if (paymentId) {
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: 'CANCELLED' }
        });
      }

      return order;
    });
  }

  async applyDiscountTransactional(orderId: number, discount: any, totals: any) {
    return this.prisma.$transaction(async (tx) => {
      // 0. Lấy order hiện tại để check xem đã từng áp discount nào chưa
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        select: { id: true, discountId: true, userId: true, guestEmail: true, guestPhone: true }
      });
      if (!existingOrder) throw new Error('Order not found');

      // 1. Atomic increment Discount.usageCount với điều kiện < usageLimit
      //    (Single source of truth: dùng field usageCount thay vì count Order).
      if (discount.usageLimit) {
        const updateResult = await tx.discount.updateMany({
          where: {
            id: discount.id,
            usageCount: { lt: discount.usageLimit },
          },
          data: { usageCount: { increment: 1 } },
        });
        if (updateResult.count === 0) {
          throw new Error('Mã giảm giá đã hết lượt sử dụng');
        }
      } else {
        await tx.discount.update({
          where: { id: discount.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      // 2. Nếu order trước đó đã có discount khác, decrement usageCount của discount cũ
      //    và xóa record DiscountUsage cũ để giữ tính nhất quán.
      if (existingOrder.discountId && existingOrder.discountId !== discount.id) {
        await tx.$executeRaw`UPDATE "Discount" SET "usageCount" = GREATEST(0, "usageCount" - 1) WHERE "id" = ${existingOrder.discountId}`;
        await tx.discountUsage.deleteMany({
          where: { orderId, discountId: existingOrder.discountId },
        });
      }

      // 3. Update order
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          subtotal: totals.totalItems,
          discountAmount: totals.discountAmount,
          total: totals.discountedTotal,
          discount: { connect: { id: discount.id } },
        },
        include: this.baseInclude
      });

      // 3b. Đồng bộ Payment.amount khi order.total thay đổi.
      //     Tránh trường hợp VNPay IPN reject (RspCode 04 - Invalid amount) do
      //     payment.amount cũ không khớp order.total mới sau khi áp voucher.
      //     Chỉ sync khi payment vẫn ở trạng thái PENDING (chưa thanh toán/chưa
      //     có link VNPay đã được khách trả).
      await tx.payment.updateMany({
        where: { orderId, status: 'PENDING' },
        data: {
          amount: totals.discountedTotal,
          // Vô hiệu link VNPay cũ vì amount nhúng trong link không còn đúng;
          // FE sẽ phải gọi lại endpoint tạo payment để lấy link mới.
          paymentLink: null,
        },
      });

      // 4. Ghi nhận DiscountUsage cho user/guest (chỉ khi chưa có cùng discount này)
      if (existingOrder.discountId !== discount.id) {
        const userIdForUsage = existingOrder.userId ?? undefined;
        const guestEmail = existingOrder.guestEmail ?? undefined;
        const guestPhone = existingOrder.guestPhone ?? undefined;
        if (userIdForUsage || guestEmail || guestPhone) {
          await tx.discountUsage.create({
            data: {
              userId: userIdForUsage,
              guestEmail,
              guestPhone,
              discountId: discount.id,
              orderId,
            },
          });
        }
      }

      return updated;
    });
  }
}
