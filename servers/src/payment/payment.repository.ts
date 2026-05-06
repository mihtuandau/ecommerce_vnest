import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
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
                  include: { product: true }
                } 
              } 
            } 
          } 
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

  async findAll(where: Prisma.PaymentWhereInput, skip: number, take: number) {
    return this.prisma.payment.findMany({
      where,
      skip,
      take,
      include: {
        order: {
          include: {
            user: true,
            orderItems: true,
            address: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where: Prisma.PaymentWhereInput): Promise<number> {
    return this.prisma.payment.count({ where });
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

  async update(id: number, data: Prisma.PaymentUpdateInput) {
    return this.prisma.payment.update({
      where: { id },
      data,
      include: { order: true },
    });
  }

  async incrementVariantStock(variantId: number, quantity: number) {
    return this.prisma.productVariant.update({ where: { id: variantId }, data: { stock: { increment: quantity } } });
  }

  async decrementProductSoldCount(productId: number, quantity: number) {
    return this.prisma.$executeRaw`UPDATE "Product" SET "soldCount" = GREATEST(0, "soldCount" - ${quantity}) WHERE "id" = ${productId}`;
  }
}
