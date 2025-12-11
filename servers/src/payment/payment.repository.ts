import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

/**
 * Repository pattern for Payment data access
 * Handles all database queries related to payments
 */
@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new payment
   */
  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
      include: { order: true },
    });
  }

  /**
   * Find payment by ID
   */
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
   * Find all payments with filters
   */
  async findAll(where: Prisma.PaymentWhereInput, skip: number, take: number) {
    return this.prisma.payment.findMany({
      where,
      skip,
      take,
      include: {
        order: {
          include: {
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

  /**
   * Count payments with filters
   */
  async count(where: Prisma.PaymentWhereInput): Promise<number> {
    return this.prisma.payment.count({ where });
  }

  /**
   * Update payment status with transaction
   */
  async updateStatusWithTransaction(
    paymentId: number,
    status: string,
    orderId: number,
    orderItems: any[],
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Update payment status
      const paymentUpdated = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: status as any },
        include: { order: true },
      });

      if (status === 'SUCCESS') {
        // Update order status & paymentId
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PROCESSING',
            paymentId,
          },
        });

        // Deduct stock from variants
        for (const item of orderItems) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return paymentUpdated;
    });
  }

  /**
   * Find order by ID
   */
  async findOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }
}
