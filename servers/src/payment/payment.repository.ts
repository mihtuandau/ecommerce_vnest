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
            orderItems: { 
              include: { variant: true } 
            } 
          } 
        },
      },
    });
  }

  /**
   * Find payment by order ID
   */
  async findByOrderId(orderId: number) {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: true,
      },
    });
  }

  /**
   * Find all payments with filters
   */
  async findAll(where: Prisma.PaymentWhereInput, skip: number, take: number) {
    return this.prisma.payment.findMany({
      where,
      skip,
      take,
      include: {
        order: {
          select: {
            id: true,
            orderCode: true,
            total: true,
            status: true,
            guestEmail: true,
            guestPhone: true,
            shippingSnapshot: true, // Đổi từ shippingInfo
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
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
          select: { status: true },
        });

        if (currentOrder && currentOrder.status === 'PENDING') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PROCESSING',
              paymentId,
            },
          });
        } else if (currentOrder) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentId },
          });
        }
        // NOTE: Stock is reserved at order creation (createOrderTransactional).
        // No need to decrement stock here again.
      }

      return paymentUpdated;
    });
  }

  /**
   * Find order by ID with details for payment
   */
  async findOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findByPayosOrderCode(orderCode: number) {
    return this.prisma.payment.findFirst({
      where: { payosOrderCode: orderCode },
      include: {
        order: {
          include: {
            orderItems: {
              include: { variant: true },
            },
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
}
