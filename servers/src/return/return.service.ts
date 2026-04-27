import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { OrderStatus, ReturnStatus } from '@prisma/client';
import { OrderRepository } from '../order/order.repository';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ReturnService {
  constructor(
    private prisma: PrismaService,
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
  ) {}

  async create(userId: number, dto: CreateReturnRequestDto) {
    // 1. Kiểm tra đơn hàng tồn tại và thuộc về user
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { returnRequest: true }
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền yêu cầu trả hàng cho đơn hàng này');
    }

    // 2. Kiểm tra trạng thái đơn hàng (phải là DELIVERED)
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Chỉ có thể yêu cầu trả hàng cho đơn hàng đã giao thành công');
    }

    // 3. Kiểm tra xem đã có yêu cầu nào chưa
    if (order.returnRequest) {
      throw new BadRequestException('Đơn hàng này đã có yêu cầu trả hàng');
    }

    // 4. Tạo yêu cầu trả hàng và cập nhật trạng thái đơn hàng trong 1 transaction
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.returnRequest.create({
        data: {
          orderId: dto.orderId,
          userId,
          reason: dto.reason,
          details: dto.details,
          images: dto.images || [],
          status: ReturnStatus.PENDING,
        }
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: {
          status: OrderStatus.RETURN_REQUESTED,
          statusHistory: {
            push: {
              status: OrderStatus.RETURN_REQUESTED,
              changedAt: new Date(),
              changedBy: userId,
              note: `Yêu cầu trả hàng: ${dto.reason}`
            }
          }
        }
      });

      return request;
    });
  }

  async findAll(query: any) {
    const { status, userId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = Number(userId);

    const [items, total] = await Promise.all([
      this.prisma.returnRequest.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          user: { select: { name: true, email: true, phone: true } },
          order: { select: { orderCode: true, total: true, status: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.returnRequest.count({ where })
    ]);

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        order: { 
          include: { 
            orderItems: {
              include: { variant: { include: { product: true } } }
            }
          } 
        }
      }
    });

    if (!request) throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');
    return request;
  }

  async updateStatus(id: number, dto: UpdateReturnRequestDto, actorId: number, isStaff: boolean = true) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!request) throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Nếu không phải nhân viên, chỉ cho phép cập nhật nếu là chủ sở hữu và chuyển sang RETURNING
    if (!isStaff) {
      if (request.userId !== actorId) {
        throw new BadRequestException('Bạn không có quyền cập nhật yêu cầu này');
      }
      if (dto.status !== ReturnStatus.RETURNING) {
        throw new BadRequestException('Khách hàng chỉ có thể cập nhật trạng thái đang gửi hàng');
      }
      if (request.status !== ReturnStatus.APPROVED) {
        throw new BadRequestException('Chỉ có thể cập nhật sau khi yêu cầu đã được duyệt');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.returnRequest.update({
        where: { id },
        data: {
          status: dto.status,
          adminNote: dto.adminNote,
        }
      });

      // 1. Khi Shop nhận được hàng (RECEIVED): Hoàn lại tồn kho và trừ doanh số
      if (dto.status === ReturnStatus.RECEIVED && request.status !== ReturnStatus.RECEIVED && request.status !== ReturnStatus.COMPLETED) {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: request.orderId },
          include: { variant: true }
        });

        for (const item of orderItems) {
          // Cộng lại stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } }
          });

          // Trừ soldCount của product
          await tx.product.update({
            where: { id: item.variant.productId },
            data: { soldCount: { decrement: item.quantity } }
          });
        }
      }

      // 2. Khi Admin đánh dấu hoàn thành (COMPLETED): Thực hiện hoàn tiền và đóng đơn
      if (dto.status === ReturnStatus.COMPLETED) {
        // Cập nhật trạng thái đơn hàng sang RETURNED
        await tx.order.update({
          where: { id: request.orderId },
          data: {
            status: OrderStatus.RETURNED,
            statusHistory: {
              push: {
                status: OrderStatus.RETURNED,
                changedAt: new Date(),
                changedBy: actorId,
                note: `Hoàn tất quy trình trả hàng: ${dto.adminNote || ""}`,
              },
            }
          }
        });

        // Thực hiện hoàn tiền nếu đã thanh toán thành công
        const payment = await tx.payment.findUnique({
          where: { orderId: request.orderId }
        });

        if (payment) {
          if (payment.status === 'SUCCESS') {
            await this.paymentService.initiateRefund(payment.id);
          } else if (payment.status === 'PENDING') {
            // Nếu chưa thanh toán (ví dụ COD), thì hủy trạng thái chờ thanh toán
            await this.prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'CANCELLED' }
            });
          }
        }
      }

      return updatedRequest;
    });
  }

  async getMyReturns(userId: number) {
    return this.prisma.returnRequest.findMany({
      where: { userId },
      include: {
        order: { select: { orderCode: true, total: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
