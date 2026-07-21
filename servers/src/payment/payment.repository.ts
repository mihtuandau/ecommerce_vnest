import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentEntity,
  CreatePaymentData,
  UpdatePaymentData,
  PaymentFilter,
} from './payment.types';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePaymentData): Promise<PaymentEntity> {
    const { orderId, ...rest } = data;
    return this.prisma.payment.create({
      data: {
        ...rest,
        order: { connect: { id: orderId } },
      },
      include: { order: true },
    });
  }

  async findById(id: number) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
            address: true,
            orderItems: {
              include: {
                variant: {
                  include: { product: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByOrderId(orderId: number) {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
  }

  async findAll(filter: PaymentFilter, skip: number, take: number) {
    return this.prisma.payment.findMany({
      where: filter,
      skip,
      take,
      include: {
        order: {
          include: {
            user: true,
            orderItems: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(filter: PaymentFilter): Promise<number> {
    return this.prisma.payment.count({ where: filter });
  }

  async updateStatusWithTransaction(
    paymentId: number,
    status: string,
    orderId: number,
    orderItems: any[],
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const paymentUpdated = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: status as any },
        include: { order: true },
      });

      if (status === 'SUCCESS') {
        const currentOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { status: true, userId: true },
        });

        if (currentOrder && currentOrder.status === 'PENDING') {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING' },
          });
        }

        // Clear giỏ hàng của user sau khi thanh toán online thành công.
        // (Khi tạo order online, ta cố tình KHÔNG clear cart để user còn cứu vãn
        //  được giỏ nếu bỏ thanh toán giữa chừng - xem OrderCreation.clearUserCartIfNeeded)
        if (currentOrder?.userId) {
          await prisma.cartItem.deleteMany({
            where: { cart: { userId: currentOrder.userId } },
          });
        }
      }

      return paymentUpdated;
    });
  }

  async findOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });
  }

  async findByOrderCode(orderCode: string) {
    return this.prisma.payment.findFirst({
      where: { order: { orderCode: orderCode } },
      include: {
        order: {
          include: {
            user: true,
            orderItems: { include: { variant: true } },
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePaymentData) {
    return this.prisma.payment.update({
      where: { id },
      data,
      include: { order: true },
    });
  }

  // Cộng dồn refundAmount một cách nguyên tử (tránh race condition khi initiateRefund
  // được gọi đồng thời nhiều lần cho cùng 1 payment gây cộng dồn sai / vượt quá số tiền gốc).
  // `where` giới hạn refundAmount hiện tại để updateMany chỉ khớp đúng bản ghi còn hợp lệ.
  async incrementRefundAmountGuarded(
    id: number,
    refundValue: number,
    maxRefundAmount: number,
  ) {
    const result = await this.prisma.payment.updateMany({
      where: {
        id,
        status: { in: ['SUCCESS', 'REFUNDED'] },
        refundAmount: { lte: maxRefundAmount - refundValue },
      },
      data: {
        status: 'REFUNDED',
        refundAmount: { increment: refundValue },
      },
    });
    return result.count > 0;
  }

  async incrementVariantStock(variantId: number, quantity: number) {
    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    });
  }

  async decrementProductSoldCount(productId: number, quantity: number) {
    return this.prisma
      .$executeRaw`UPDATE "Product" SET "soldCount" = GREATEST(0, "soldCount" - ${quantity}) WHERE "id" = ${productId}`;
  }
}
