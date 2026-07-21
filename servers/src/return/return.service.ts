import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { CreateGuestReturnRequestDto } from './dto/create-guest-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { OrderStatus, ReturnStatus } from '@prisma/client';
import { PaymentService } from '../payment/payment.service';
import { ReturnRepository, ValidatedReturnItem } from './return.repository';

@Injectable()
export class ReturnService {
  constructor(
    private returnRepository: ReturnRepository,
    private paymentService: PaymentService,
  ) {}

  async create(userId: number, dto: CreateReturnRequestDto) {
    const order = await this.returnRepository.findOrderWithReturnContext(
      dto.orderId,
    );

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId)
      throw new BadRequestException('Không có quyền yêu cầu trả hàng');
    if (order.status !== OrderStatus.DELIVERED)
      throw new BadRequestException('Chỉ có thể trả hàng cho đơn đã giao');

    const validatedItems = this.validateReturnItems(
      order.orderItems,
      dto.items,
    );
    const refundAmount = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.returnRepository.createReturnRequestTx({
      orderId: dto.orderId,
      userId,
      dto,
      refundAmount,
      validatedItems,
      changedBy: userId,
      note: `Yêu cầu trả hàng một phần: ${dto.reason}`,
    });
  }

  async createGuest(dto: CreateGuestReturnRequestDto) {
    const order = await this.returnRepository.findOrderWithReturnContext(
      dto.orderId,
    );

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    // BẢO MẬT: Nếu đơn hàng đã thuộc về thành viên, bắt buộc phải đăng nhập
    if (order.userId) {
      throw new BadRequestException(
        'Đơn hàng này đã được liên kết với một tài khoản thành viên. Vui lòng đăng nhập để thực hiện yêu cầu trả hàng.',
      );
    }

    const normalize = (s: string | null | undefined) =>
      s?.trim().toLowerCase() || '';
    if (
      normalize(order.orderCode) !== normalize(dto.orderCode) ||
      (normalize(dto.contact) !== normalize(order.guestEmail) &&
        normalize(dto.contact) !== normalize(order.guestPhone))
    ) {
      throw new BadRequestException('Thông tin xác thực không khớp');
    }

    if (order.status !== OrderStatus.DELIVERED)
      throw new BadRequestException('Chỉ có thể trả hàng cho đơn đã giao');

    const validatedItems = this.validateReturnItems(
      order.orderItems,
      dto.items,
    );
    const refundAmount = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.returnRepository.createReturnRequestTx({
      orderId: order.id,
      userId: order.userId,
      dto,
      refundAmount,
      validatedItems,
      changedBy: 0,
      note: `Yêu cầu trả hàng một phần (Guest): ${dto.reason}`,
    });
  }

  private validateReturnItems(
    orderItems: any[],
    returnItems: { orderItemId: number; quantity: number }[],
  ): ValidatedReturnItem[] {
    const results: ValidatedReturnItem[] = [];

    for (const rItem of returnItems) {
      const oItem = orderItems.find((i) => i.id === rItem.orderItemId);
      if (!oItem)
        throw new BadRequestException(
          `Sản phẩm (ID: ${rItem.orderItemId}) không thuộc đơn hàng này`,
        );

      const alreadyReturned = oItem.returnItems
        .filter((ri: any) => ri.returnRequest?.status !== 'REJECTED')
        .reduce((sum: number, ri: any) => sum + ri.quantity, 0);

      const available = oItem.quantity - alreadyReturned;
      if (rItem.quantity > available) {
        throw new BadRequestException(
          `Sản phẩm ${oItem.productName} chỉ còn ${available} sản phẩm có thể trả hàng (Đã trả: ${alreadyReturned})`,
        );
      }

      results.push({
        orderItemId: oItem.id,
        quantity: rItem.quantity,
        price: oItem.price,
        variantId: oItem.variantId,
        productId: oItem.variant.productId,
        productName: oItem.productName,
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

    const { items, total } = await this.returnRepository.findAllReturns(
      where,
      Number(skip),
      Number(limit),
    );

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, actor?: { userId: number; role: string }) {
    const request = await this.returnRepository.findReturnDetail(id);

    if (!request)
      throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Bảo mật: Nếu là khách hàng, chỉ cho phép xem đơn của chính mình
    if (actor && !['ADMIN', 'WAREHOUSE', 'SALES'].includes(actor.role)) {
      if (request.userId !== actor.userId) {
        throw new NotFoundException(
          'Không tìm thấy yêu cầu trả hàng hoặc bạn không có quyền truy cập',
        );
      }
    }

    return request;
  }

  async updateStatus(
    id: number,
    dto: UpdateReturnRequestDto,
    actorId: number,
    isStaff: boolean = true,
  ) {
    const request = await this.returnRepository.findReturnWithOrder(id);

    if (!request)
      throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Nếu không phải nhân viên, chỉ cho phép cập nhật nếu là chủ sở hữu và chuyển sang RETURNING
    if (!isStaff) {
      if (request.userId !== actorId) {
        throw new BadRequestException(
          'Bạn không có quyền cập nhật yêu cầu này',
        );
      }
      if (dto.status !== ReturnStatus.RETURNING) {
        throw new BadRequestException(
          'Khách hàng chỉ có thể cập nhật trạng thái đang gửi hàng',
        );
      }
      if (request.status !== ReturnStatus.APPROVED) {
        throw new BadRequestException(
          'Chỉ có thể cập nhật sau khi yêu cầu đã được duyệt',
        );
      }
    }

    // --- Bước 1: Thực hiện toàn bộ thao tác DB trong 1 transaction ---
    // Lưu lại thông tin hoàn tiền cần thực hiện SAU khi tx commit.
    // KHÔNG gọi initiateRefund bên trong tx vì nó dùng connection pool riêng
    // để update cùng row payment đang bị lock → deadlock/timeout.
    const { result, paymentIdToRefund, refundAmountToProcess } =
      await this.returnRepository.updateStatusTx({
        id,
        orderId: request.orderId,
        requestStatus: request.status,
        requestRefundAmount: request.refundAmount,
        requestUserId: request.userId,
        dto,
        actorId,
      });

    // --- Bước 2: Gọi initiateRefund SAU khi transaction đã commit ---
    // Lý do tách ra: tx đang giữ DB lock trên row payment; nếu initiateRefund
    // cũng dùng prisma client riêng để update row đó → deadlock.
    if (paymentIdToRefund !== null && refundAmountToProcess !== null) {
      try {
        await this.paymentService.initiateRefund(
          paymentIdToRefund,
          refundAmountToProcess,
        );
      } catch (error) {
        // Không fail toàn bộ request — trạng thái return đã commit thành công.
        // Admin có thể thực hiện hoàn tiền thủ công nếu cần.
        console.error(
          `[ReturnService] initiateRefund failed for payment ${paymentIdToRefund} after COMPLETED:`,
          error,
        );
      }
    }

    return result;
  }

  async getMyReturns(userId: number) {
    return this.returnRepository.findReturnsByUser(userId);
  }

  async confirmSent(userId: number, id: number) {
    const request = await this.returnRepository.findReturnWithOrder(id);

    if (!request)
      throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    if (request.order.userId !== userId) {
      throw new BadRequestException(
        'Bạn không có quyền thao tác trên yêu cầu trả hàng này',
      );
    }

    if (request.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException(
        'Chỉ có thể xác nhận gửi hàng sau khi yêu cầu đã được duyệt',
      );
    }

    return this.returnRepository.setReturningStatus(id);
  }

  async confirmGuestSent(
    id: number,
    dto: { orderCode: string; contact: string },
  ) {
    const request = await this.returnRepository.findReturnWithOrder(id);

    if (!request)
      throw new NotFoundException('Không tìm thấy yêu cầu trả hàng');

    // Xác thực thông tin khách vãng lai
    const normalize = (s: string | null | undefined) =>
      s?.trim().toLowerCase() || '';
    const inputCode = normalize(dto.orderCode);
    const dbCode = normalize(request.order.orderCode);
    const inputContact = normalize(dto.contact);
    const dbEmail = normalize(request.order.guestEmail);
    const dbPhone = normalize(request.order.guestPhone);

    if (
      dbCode !== inputCode ||
      (inputContact !== dbEmail && inputContact !== dbPhone)
    ) {
      throw new BadRequestException('Thông tin xác thực không chính xác');
    }

    if (request.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException(
        'Chỉ có thể xác nhận gửi hàng sau khi yêu cầu đã được duyệt',
      );
    }

    return this.returnRepository.setReturningStatus(id);
  }
}
