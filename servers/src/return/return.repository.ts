import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, ReturnStatus, Prisma } from '@prisma/client';
import { OrderCache } from '../order/order.cache';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';

export interface ValidatedReturnItem {
  orderItemId: number;
  quantity: number;
  price: number;
  variantId: number;
  productId: number;
  productName: string;
}

@Injectable()
export class ReturnRepository {
  constructor(
    private prisma: PrismaService,
    private cacheService: OrderCache,
  ) {}

  findOrderWithReturnContext(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            variant: true,
            returnItems: {
              include: { returnRequest: true },
            },
          },
        },
        returnRequests: true,
      },
    });
  }

  createReturnRequestTx(params: {
    orderId: number;
    userId: number | null;
    dto: { reason: string; details?: string; images?: string[] };
    refundAmount: number;
    validatedItems: ValidatedReturnItem[];
    changedBy: number;
    note: string;
  }) {
    const { orderId, userId, dto, refundAmount, validatedItems, changedBy, note } =
      params;

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.returnRequest.create({
        data: {
          orderId,
          userId,
          reason: dto.reason,
          details: dto.details,
          images: dto.images || [],
          status: ReturnStatus.PENDING,
          refundAmount,
          returnItems: {
            create: validatedItems.map((item) => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
            })),
          },
        },
        include: { returnItems: true },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          returnStatus: ReturnStatus.PENDING,
          statusHistory: {
            push: {
              status: OrderStatus.RETURN_REQUESTED,
              changedAt: new Date(),
              changedBy,
              note,
            },
          },
        },
      });

      return request;
    });
  }

  async findAllReturns(where: Prisma.ReturnRequestWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.returnRequest.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          order: { select: { orderCode: true, total: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.returnRequest.count({ where }),
    ]);

    return { items, total };
  }

  findReturnDetail(id: number) {
    return this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        returnItems: {
          include: {
            orderItem: true,
          },
        },
        order: {
          include: {
            orderItems: {
              include: {
                variant: { include: { product: true } },
                returnItems: {
                  include: { returnRequest: true },
                },
              },
            },
          },
        },
      },
    });
  }

  findReturnWithOrder(id: number) {
    return this.prisma.returnRequest.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  /**
   * Mirrors the full status-update transaction previously inline in ReturnService.
   * Kept as a single transactional method (rather than several small repo calls)
   * so the atomic guard / stock restore / order status cascade behavior is
   * preserved exactly as before.
   */
  updateStatusTx(params: {
    id: number;
    orderId: number;
    requestStatus: ReturnStatus;
    requestRefundAmount: number;
    requestUserId: number | null;
    dto: UpdateReturnRequestDto;
    actorId: number;
  }) {
    const { id, orderId, requestStatus, requestRefundAmount, requestUserId, dto, actorId } =
      params;

    let paymentIdToRefund: number | null = null;
    let refundAmountToProcess: number | null = null;

    const resultPromise = this.prisma.$transaction(async (tx) => {
      // Atomic guard: chỉ update nếu status hiện tại chưa là COMPLETED
      // Ngăn double refund khi 2 request đồng thời gọi COMPLETED
      const guard = await tx.returnRequest.updateMany({
        where: { id, status: { not: ReturnStatus.COMPLETED } },
        data: { status: dto.status, adminNote: dto.adminNote },
      });

      if (guard.count === 0) {
        return tx.returnRequest.findUnique({
          where: { id },
          include: {
            returnItems: {
              include: { orderItem: { include: { variant: true } } },
            },
          },
        });
      }

      const updatedRequest = await tx.returnRequest.findUnique({
        where: { id },
        include: {
          returnItems: {
            include: { orderItem: { include: { variant: true } } },
          },
        },
      });

      if (!updatedRequest) return null;

      // Cập nhật returnStatus trên Order tương ứng với trạng thái mới của yêu cầu trả hàng
      await tx.order.update({
        where: { id: orderId },
        data: { returnStatus: dto.status },
      });

      // 1. Khi Shop nhận được hàng (RECEIVED): Hoàn lại tồn kho cho các món trong yêu cầu này
      if (
        dto.status === ReturnStatus.RECEIVED &&
        requestStatus !== ReturnStatus.RECEIVED &&
        requestStatus !== ReturnStatus.COMPLETED
      ) {
        for (const rItem of updatedRequest.returnItems) {
          // Cộng lại stock
          await tx.productVariant.update({
            where: { id: rItem.orderItem.variantId },
            data: { stock: { increment: rItem.quantity } },
          });

          // Trừ soldCount của product (GREATEST để tránh âm)
          await tx.$executeRaw`UPDATE "Product" SET "soldCount" = GREATEST(0, "soldCount" - ${rItem.quantity}) WHERE "id" = ${rItem.orderItem.variant.productId}`;
        }
      }

      // 2. Khi Admin đánh dấu hoàn thành (COMPLETED): Thu thập thông tin hoàn tiền
      //    KHÔNG gọi initiateRefund ở đây — sẽ gọi sau khi transaction commit
      //    để tránh deadlock (tx đang giữ lock row payment).
      if (dto.status === ReturnStatus.COMPLETED) {
        const payment = await tx.payment.findUnique({
          where: { orderId },
        });

        if (payment && payment.status === 'SUCCESS') {
          paymentIdToRefund = payment.id;
          refundAmountToProcess = requestRefundAmount;
        }

        // Kiểm tra xem đã trả hết toàn bộ đơn hàng chưa để cập nhật status Order
        const allCompletedReturns = await tx.returnRequest.findMany({
          where: { orderId, status: ReturnStatus.COMPLETED },
          include: { returnItems: true },
        });

        const totalReturned = allCompletedReturns.reduce(
          (sum, r) => sum + r.returnItems.reduce((s, ri) => s + ri.quantity, 0),
          0,
        );

        const orderInfo = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });

        if (!orderInfo) return;

        const totalOrdered = orderInfo.orderItems.reduce(
          (sum, i) => sum + i.quantity,
          0,
        );

        if (totalReturned >= totalOrdered) {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.RETURNED,
              returnStatus: ReturnStatus.COMPLETED,
              refundedAmount: { increment: requestRefundAmount },
              statusHistory: {
                push: {
                  status: OrderStatus.RETURNED,
                  changedAt: new Date(),
                  changedBy: actorId,
                  note: `Hoàn tất trả hàng toàn bộ đơn hàng (Hoàn tiền: ${requestRefundAmount.toLocaleString('vi-VN')}đ).`,
                },
              },
            },
          });
        } else {
          // Trả hàng một phần — giữ DELIVERED, cập nhật returnStatus
          await tx.order.update({
            where: { id: orderId },
            data: {
              returnStatus: ReturnStatus.COMPLETED,
              refundedAmount: { increment: requestRefundAmount },
              statusHistory: {
                push: {
                  status: OrderStatus.DELIVERED,
                  changedAt: new Date(),
                  changedBy: actorId,
                  note: `Hoàn tất trả hàng một phần (Hoàn tiền: ${requestRefundAmount.toLocaleString('vi-VN')}đ).`,
                },
              },
            },
          });
        }
      }

      // Xóa cache đơn hàng để cập nhật trạng thái mới lên UI ngay lập tức
      await this.cacheService.clearRelatedCaches(orderId, requestUserId || undefined);

      return updatedRequest;
    });

    return resultPromise.then((result) => ({
      result,
      paymentIdToRefund,
      refundAmountToProcess,
    }));
  }

  findReturnsByUser(userId: number) {
    return this.prisma.returnRequest.findMany({
      where: { userId },
      include: {
        order: { select: { orderCode: true, total: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  setReturningStatus(id: number) {
    return this.prisma.returnRequest.update({
      where: { id },
      data: { status: ReturnStatus.RETURNING },
    });
  }
}
