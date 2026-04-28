import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { CreateGuestReturnRequestDto } from './dto/create-guest-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { OrderStatus, ReturnStatus } from '@prisma/client';
import { OrderRepository } from '../order/order.repository';
import { PaymentService } from '../payment/payment.service';
import { OrderCache } from '../order/order.cache';

@Injectable()
export class ReturnService {
  constructor(
    private prisma: PrismaService,
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
    private cacheService: OrderCache,
  ) {}

  async create(userId: number, dto: CreateReturnRequestDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { 
        orderItems: {
          include: { returnItems: true }
        },
        returnRequests: true 
      }
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) throw new BadRequestException('Không có quyền yêu cầu trả hàng');
    if (order.status !== OrderStatus.DELIVERED) throw new BadRequestException('Chỉ có thể trả hàng cho đơn đã giao');

    const validatedItems = this.validateReturnItems(order.orderItems, dto.items);
    const refundAmount = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.returnRequest.create({
        data: {
          orderId: dto.orderId,
          userId,
          reason: dto.reason,
          details: dto.details,
          images: dto.images || [],
          status: ReturnStatus.PENDING,
          refundAmount,
          returnItems: {
            create: validatedItems.map(item => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
            }))
          }
        },
        include: { returnItems: true }
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
              note: `Yêu cầu trả hàng một phần: ${dto.reason}`
            }
          }
        }
      });

      return request;
    });
  }

  async createGuest(dto: CreateGuestReturnRequestDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { 
        orderItems: {
          include: { returnItems: true }
        },
        returnRequests: true 
      }
    });
    
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const normalize = (s: string | null | undefined) => s?.trim().toLowerCase() || '';
    if (normalize(order.orderCode) !== normalize(dto.orderCode) || 
        (normalize(dto.contact) !== normalize(order.guestEmail) && normalize(dto.contact) !== normalize(order.guestPhone))) {
      throw new BadRequestException('Thông tin xác thực không khớp');
    }

    if (order.status !== OrderStatus.DELIVERED) throw new BadRequestException('Chỉ có thể trả hàng cho đơn đã giao');

    const validatedItems = this.validateReturnItems(order.orderItems, dto.items);
    const refundAmount = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.returnRequest.create({
        data: {
          orderId: order.id,
          userId: order.userId,
          reason: dto.reason,
          details: dto.details,
          images: dto.images || [],
          status: ReturnStatus.PENDING,
          refundAmount,
          returnItems: {
            create: validatedItems.map(item => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
            }))
          }
        },
        include: { returnItems: true }
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.RETURN_REQUESTED,
          statusHistory: {
            push: {
              status: OrderStatus.RETURN_REQUESTED,
              changedAt: new Date(),
              changedBy: 0,
              note: `Yêu cầu trả hàng một phần (Guest): ${dto.reason}`
            }
          }
        }
      });

      return request;
    });
  }

  private validateReturnItems(orderItems: any[], returnItems: { orderItemId: number, quantity: number }[]) {
    const results: { 
      orderItemId: number; 
      quantity: number; 
      price: number; 
      variantId: number; 
      productId: number; 
      productName: string; 
    }[] = [];
    
    for (const rItem of returnItems) {
      const oItem = orderItems.find(i => i.id === rItem.orderItemId);
      if (!oItem) throw new BadRequestException(`Sản phẩm (ID: ${rItem.orderItemId}) không thuộc đơn hàng này`);
      
      const alreadyReturned = oItem.returnItems
        .filter((ri: any) => ri.returnRequest?.status !== 'REJECTED')
        .reduce((sum: number, ri: any) => sum + ri.quantity, 0);

      const available = oItem.quantity - alreadyReturned;
      if (rItem.quantity > available) {
        throw new BadRequestException(`Sản phẩm ${oItem.productName} chỉ còn ${available} sản phẩm có thể trả hàng (Đã trả: ${alreadyReturned})`);
      }
      
      results.push({
        orderItemId: oItem.id,
        quantity: rItem.quantity,
        price: oItem.price,
        variantId: oItem.variantId,
        productId: oItem.variant.productId,
        productName: oItem.productName
      });
    }
    return results;
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

  async findOne(id: number, actor?: { userId: number; role: string }) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        returnItems: {
          include: {
            orderItem: true
          }
        },
        order: { 
          include: { 
            orderItems: {
              include: { 
                variant: { include: { product: true } },
                returnItems: {
                  include: { returnRequest: true }
                }
              }
            }
          } 
        }
      }
    });

    if (!request) throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Bảo mật: Nếu là khách hàng, chỉ cho phép xem đơn của chính mình
    if (actor && !['ADMIN', 'KHO', 'BAN_HANG'].includes(actor.role)) {
      if (request.userId !== actor.userId) {
        throw new NotFoundException('Không tìm thấy yêu cầu trả hàng hoặc bạn không có quyền truy cập');
      }
    }

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
        },
        include: { returnItems: { include: { orderItem: { include: { variant: true } } } } }
      });

      // 1. Khi Shop nhận được hàng (RECEIVED): Hoàn lại tồn kho cho các món trong yêu cầu này
      if (dto.status === ReturnStatus.RECEIVED && request.status !== ReturnStatus.RECEIVED && request.status !== ReturnStatus.COMPLETED) {
        for (const rItem of updatedRequest.returnItems) {
          // Cộng lại stock
          await tx.productVariant.update({
            where: { id: rItem.orderItem.variantId },
            data: { stock: { increment: rItem.quantity } }
          });

          // Trừ soldCount của product
          await tx.product.update({
            where: { id: rItem.orderItem.variant.productId },
            data: { soldCount: { decrement: rItem.quantity } }
          });
        }
      }

      // 2. Khi Admin đánh dấu hoàn thành (COMPLETED): Thực hiện hoàn tiền
      if (dto.status === ReturnStatus.COMPLETED) {
        // Thực hiện hoàn tiền (Dùng refundAmount của request thay vì toàn bộ payment.amount)
        const payment = await tx.payment.findUnique({
          where: { orderId: request.orderId }
        });

        if (payment && payment.status === 'SUCCESS') {
          await this.paymentService.initiateRefund(payment.id, request.refundAmount);
        }

        // Kiểm tra xem đã trả hết toàn bộ đơn hàng chưa để cập nhật status Order
        // Logic đơn giản: Nếu tổng số lượng trong returnItems (tất cả COMPLETED requests) == tổng số lượng trong orderItems
        const allCompletedReturns = await tx.returnRequest.findMany({
          where: { orderId: request.orderId, status: ReturnStatus.COMPLETED },
          include: { returnItems: true }
        });
        
        const totalReturned = allCompletedReturns.reduce((sum, r) => sum + r.returnItems.reduce((s, ri) => s + ri.quantity, 0), 0);
        
        const orderInfo = await tx.order.findUnique({
          where: { id: request.orderId },
          include: { orderItems: true }
        });
        
        if (!orderInfo) return;

        const totalOrdered = orderInfo.orderItems.reduce((sum, i) => sum + i.quantity, 0);

        if (totalReturned >= totalOrdered) {
          await tx.order.update({
            where: { id: request.orderId },
            data: {
              status: OrderStatus.RETURNED,
              statusHistory: {
                push: {
                  status: OrderStatus.RETURNED,
                  changedAt: new Date(),
                  changedBy: actorId,
                  note: `Hoàn tất trả hàng toàn bộ đơn hàng.`,
                },
              }
            }
          });
        } else {
          // Vẫn để status là DELIVERED hoặc một status "PARTIALLY_RETURNED" nếu có
          // Hiện tại cứ giữ DELIVERED hoặc ghi log vào statusHistory
          await tx.order.update({
            where: { id: request.orderId },
            data: {
              statusHistory: {
                push: {
                  status: OrderStatus.DELIVERED,
                  changedAt: new Date(),
                  changedBy: actorId,
                  note: `Hoàn tất trả hàng một phần (Hoàn: ${request.refundAmount}).`,
                },
              }
            }
          });
        }
      }

      // Xóa cache đơn hàng để cập nhật trạng thái mới lên UI ngay lập tức
      await this.cacheService.clearRelatedCaches(request.orderId, request.userId || undefined);

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

  async confirmGuestSent(id: number, dto: { orderCode: string; contact: string }) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!request) throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Xác thực thông tin khách vãng lai
    const normalize = (s: string | null | undefined) => s?.trim().toLowerCase() || '';
    const inputCode = normalize(dto.orderCode);
    const dbCode = normalize(request.order.orderCode);
    const inputContact = normalize(dto.contact);
    const dbEmail = normalize(request.order.guestEmail);
    const dbPhone = normalize(request.order.guestPhone);

    if (dbCode !== inputCode || (inputContact !== dbEmail && inputContact !== dbPhone)) {
      throw new BadRequestException('Thông tin xác thực không chính xác');
    }

    if (request.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException('Chỉ có thể xác nhận gửi hàng sau khi yêu cầu đã được duyệt');
    }

    return this.prisma.returnRequest.update({
      where: { id },
      data: { status: ReturnStatus.RETURNING }
    });
  }
}
