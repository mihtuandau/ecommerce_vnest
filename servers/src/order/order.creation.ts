import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as OrderHelper from './order.helper';
import { PrismaService } from '../prisma/prisma.service';
import { GHNService } from '../ghn/ghn.service';
import { ConfigService } from '@nestjs/config';
import * as DiscountUtil from '../common/utils/discount.util';

@Injectable()
export class OrderCreation {
  private readonly logger = new Logger(OrderCreation.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private cartService: CartService,
    private paymentService: PaymentService,
    private mailService: MailService,
    private prisma: PrismaService,
    private ghnService: GHNService,
    private configService: ConfigService,
  ) {}

  async create(userId: number | null, dto: CreateOrderDto, ipAddr: string = '127.0.0.1'): Promise<any> {
    const itemsToOrder = await this.getItemsToOrder(userId, dto);
    const variantIds = itemsToOrder.map((i) => i.variantId);

    // 1. Auto-apply Flash Sale prices only if NO manual discount code provided
    const autoDiscountPriceMap = dto.discountCode
      ? new Map() // Skip auto-apply if user has manual discount
      : await this.repository.findAutoApplyPricesForVariants(variantIds);

    // 2. Chuẩn bị danh sách items với giá đã giảm (nếu có)
    const itemsWithDiscounts = itemsToOrder.map((item) => {
      const discountedPrice = autoDiscountPriceMap.get(item.variantId);
      return {
        ...item,
        price:
          discountedPrice !== undefined && discountedPrice < item.price
            ? discountedPrice
            : item.price,
      };
    });

    const originalSubtotal = itemsToOrder.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const autoApplySubtotal = itemsWithDiscounts.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const autoApplySaving = originalSubtotal - autoApplySubtotal;

    // 3. Kiểm tra mã giảm giá thủ công (Voucher)
    const discount = await this.validateDiscount(
      dto.discountCode,
      originalSubtotal,
      userId,
    );
    let manualCodeSaving = 0;
    if (discount) {
      if (discount.percentage) {
        manualCodeSaving = Math.round(
          (originalSubtotal * discount.percentage) / 100,
        );
      } else if (discount.fixedAmount) {
        manualCodeSaving = discount.fixedAmount;
      }
      if (
        discount.maxDiscountAmount &&
        manualCodeSaving > discount.maxDiscountAmount
      ) {
        manualCodeSaving = discount.maxDiscountAmount;
      }
      manualCodeSaving = Math.min(manualCodeSaving, originalSubtotal);
    }

    // 4. Quyết định dùng Flash Sale hay Voucher (cái nào lợi hơn cho khách)
    const useAutoApply =
      autoApplySaving > 0 && autoApplySaving >= manualCodeSaving;
    const finalItems = useAutoApply ? itemsWithDiscounts : itemsToOrder;
    const finalDiscount = useAutoApply ? null : discount;

    const discountData = finalDiscount
      ? {
          percentage: finalDiscount.percentage || undefined,
          fixedAmount: finalDiscount.fixedAmount || undefined,
          maxDiscountAmount: finalDiscount.maxDiscountAmount || undefined,
        }
      : {
          fixedAmount: useAutoApply ? autoApplySaving : 0,
        };

    // 5. Tính phí vận chuyển qua GHN
    // Mặc định phí ship là 30k, trừ khi là đơn POS thì mặc định là 0
    const isPOS = dto.status === 'DELIVERED' || dto.shippingAddress === 'Mua tại quầy';
    let ghnShippingFee = isPOS ? 0 : 30000;
    
    // Chỉ chấp nhận phí ship từ DTO nếu đó là Admin tạo đơn hoặc có lý do đặc biệt (sẽ log lại)
    // Ở đây chúng ta ưu tiên phí ship từ DTO nếu được cung cấp, nhưng sẽ kiểm tra lại qua GHN
    if (dto.shippingFee !== undefined) {
      ghnShippingFee = dto.shippingFee;
    }

    try {
      const shippingFeeResult = await this.calculateGHNFee(dto, finalItems);
      if (shippingFeeResult) {
        ghnShippingFee = shippingFeeResult;
      } else {
        // GHN calculation failed
        const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
        if (isOnlinePayment && !isPOS) {
          throw new BadRequestException('Không thể tính phí vận chuyển. Vui lòng kiểm tra lại địa chỉ giao hàng.');
        }
        // Nếu là COD và GHN fail, chúng ta ép giá tối thiểu 20k nếu user gửi lên 0
        if (!isPOS && ghnShippingFee < 20000) {
          ghnShippingFee = 30000; 
        }
      }
    } catch (error) {
      const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
      if (isOnlinePayment && !isPOS) {
        throw new BadRequestException('Không thể tính phí vận chuyển qua GHN. Vui lòng thử lại.');
      }
      
      // Nếu GHN lỗi, dùng giá mặc định an toàn cho COD
      if (!isPOS && ghnShippingFee < 20000) {
        ghnShippingFee = 30000;
      }
      
      if (!isPOS) {
        this.logger.warn('GHN fee calculation failed, using fallback:', error.message);
      }
    }

    const totals = OrderHelper.calculateOrderTotal(
      finalItems,
      ghnShippingFee,
      finalDiscount ? discountData : undefined,
    );

    const orderCode = await OrderHelper.generateOrderCode((code) =>
      this.repository.findByCode(code),
    );

    const orderData = OrderHelper.prepareOrderData(
      orderCode,
      userId,
      dto,
      finalItems,
      {
        subtotal: totals.totalItems,
        shippingFee: totals.shippingFee,
        discountAmount: totals.discountAmount,
        total: totals.discountedTotal,
      },
      finalDiscount,
    );

    const order = (await this.repository.createOrderTransactional(
      orderData,
      finalItems,
      finalDiscount?.id ?? undefined,
      finalDiscount?.usageLimit ?? undefined,
    )) as any;

    const payment = await this.createPaymentRecord(order.id, dto.paymentMethod, ipAddr, order.status);
    
    // Log để kiểm tra ngay tại Server
    console.log(`[OrderCreation] Created payment for ${order.orderCode}: ${payment ? 'OK' : 'NULL'}`);
    if (payment) {
      console.log(`[OrderCreation] Link detail: ${payment.paymentLink ? 'FOUND' : 'NOT FOUND'}`);
    }

    if (dto.paymentMethod === 'VNPAY' && (!payment || !payment.paymentLink)) {
      throw new BadRequestException('Hệ thống không thể tạo liên kết thanh toán VNPay. Vui lòng kiểm tra lại cấu hình.');
    }

    await this.clearUserCartIfNeeded(userId, dto);
    if (userId) await this.cacheService.deleteUserOrderCaches(userId);
    await this.sendConfirmationEmail(order);

    // Trả về dữ liệu cực kỳ tường minh
    return {
      ...order,
      payment: payment,
      paymentLink: payment?.paymentLink || null,
    };
  }

  private async getItemsToOrder(userId: number | null, dto: CreateOrderDto) {
    if (dto.items && dto.items.length > 0) {
      return await this.prepareItemsFromDto(dto.items);
    } else {
      if (!userId) {
        throw new BadRequestException(
          'Guest checkout requires items in request body',
        );
      }
      return await this.prepareItemsFromCart(userId);
    }
  }

  private async prepareItemsFromDto(
    items: Array<{ variantId: number; quantity: number; price?: number }>,
  ) {
    const variantIds = items.map((item) => item.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { 
        id: { in: variantIds },
        isActive: true,
        product: { deletedAt: null, isActive: true } 
      },
      select: {
        id: true, productId: true, price: true, originalPrice: true, weight: true, length: true, width: true, height: true,
        product: {
          select: { id: true, name: true, isActive: true, deletedAt: true, originalPrice: true, categoryId: true, category: { select: { name: true } } },
        },
      },
    });

    if (!variants || variants.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const activeDiscounts = await this.getActiveDiscounts();

    return items.map((item) => {
      const variant = variantMap.get(item.variantId);
      if (!variant) return null;

      const discountedPrice = DiscountUtil.calculateDiscountedPrice(
        variant as any,
        activeDiscounts
      );

      const isFlashSaleActive = discountedPrice < variant.price;

      return {
        variantId: item.variantId,
        productId: variant.productId,
        quantity: item.quantity,
        // PRIORITY LOGIC:
        // 1. If Flash Sale active: Selling Price = Discounted, Strikethrough = Normal Variant Price
        // 2. No Flash Sale: Selling Price = Normal Variant Price, Strikethrough = MSRP (OriginalPrice)
        price: discountedPrice,
        originalPrice: isFlashSaleActive 
          ? variant.price 
          : (variant.originalPrice || variant.product?.originalPrice),
        productName: variant.product?.name || 'Sản phẩm',
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        category: (variant.product as any)?.category?.name,
      };
    }).filter(Boolean);
  }

  private async getActiveDiscounts() {
    const now = new Date();
    return this.prisma.discount.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        AND: [
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
          { OR: [{ isFlashSale: true }, { code: "" }] },
        ],
      },
      include: {
        applicableToProducts: { select: { productId: true } },
        applicableToCategories: { select: { categoryId: true } },
      },
    });
  }

  private async prepareItemsFromCart(userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    return cart.cartItems.map((item) => {
      const isFlashSaleActive = item.discountedPrice && item.discountedPrice < (item.variant?.price || 0);

      return {
        variantId: item.variantId,
        productId: item.variant?.productId,
        quantity: item.quantity,
        // PRIORITY LOGIC:
        // 1. If Flash Sale active: Selling Price = Discounted, Strikethrough = Normal Variant Price
        // 2. No Flash Sale: Selling Price = Normal Variant Price, Strikethrough = MSRP (OriginalPrice)
        price: item.discountedPrice || item.variant?.price || 0,
        originalPrice: isFlashSaleActive 
          ? item.variant?.price 
          : (item.variant?.originalPrice || item.variant?.product?.originalPrice),
        productName: item.variant?.product?.name || 'Sản phẩm',
        weight: item.variant?.weight,
        length: item.variant?.length,
        width: item.variant?.width,
        height: item.variant?.height,
        category: item.variant?.product?.category?.name,
      };
    });
  }

  private async calculateGHNFee(dto: CreateOrderDto, items: any[]) {
    let districtCode: string | null = null;
    let wardCode: string | null = null;

    if (dto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: dto.addressId },
      });
      if (address) {
        districtCode = address.districtCode;
        wardCode = address.wardCode;
      }
    } else if (dto.shippingInfo) {
      districtCode = dto.shippingInfo.districtCode;
      wardCode = dto.shippingInfo.wardCode;
    }

    if (!districtCode || !wardCode) return null;

    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 200) * item.quantity,
      0,
    );
    const maxLength = Math.max(...items.map((i) => i.length || 10));
    const maxWidth = Math.max(...items.map((i) => i.width || 10));
    const totalHeight = items.reduce(
      (sum, i) => sum + (i.height || 5) * i.quantity,
      0,
    );

    const fromDistrictId = Number(
      this.configService.get('GHN_FROM_DISTRICT_ID'),
    );
    if (!fromDistrictId) return null;

    const feeData = {
      from_district_id: fromDistrictId,
      service_id: 0,
      service_type_id: 2,
      to_district_id: Number(districtCode),
      to_ward_code: wardCode,
      height: Math.min(totalHeight, 150),
      length: Math.min(maxLength, 150),
      weight: Math.min(totalWeight, 30000),
      width: Math.min(maxWidth, 150),
      insurance_value: 0,
      coupon: null,
    };

    const result = await this.ghnService.calculateFee(feeData);
    return result.data.total;
  }

  private async validateDiscount(discountCode?: string, subtotal?: number, userId?: number | null) {
    if (!discountCode) return null;
    console.log(`[OrderCreation] Validating discount: ${discountCode} for userId: ${userId}`);
    const discount = await this.repository.findDiscountByCode(discountCode);
    if (!discount) throw new BadRequestException('Mã giảm giá không tồn tại');
    if (discount.isFlashSale)
      throw new BadRequestException('Mã Flash Sale đã được áp dụng tự động');

    const usageCount = await this.repository.countOrdersUsingDiscount(
      discount.id,
    );
    OrderHelper.validateDiscount(discount, subtotal, usageCount);

    // Kiểm tra giới hạn sử dụng của người dùng (mỗi người dùng 1 lần)
    if (userId) {
      const hasUsed = await this.repository.hasUserUsedDiscount(userId, discount.id);
      console.log(`[OrderCreation] User ${userId} has used discount ${discount.id}: ${hasUsed}`);
      if (hasUsed) {
        throw new BadRequestException('Bạn đã sử dụng mã giảm giá này cho đơn hàng trước đó');
      }
    }

    return discount;
  }

  private async createPaymentRecord(orderId: number, paymentMethod?: string, ipAddr: string = '127.0.0.1', orderStatus?: string) {
    // Chuẩn hóa phương thức thanh toán: COD từ frontend -> CASH trong enum
    const method = paymentMethod?.toUpperCase();
    let finalMethod = 'CASH';

    if (method === 'VNPAY' || method === 'PAYOS') {
      finalMethod = 'VNPAY';
    } else if (method === 'MOMO') {
      finalMethod = 'MOMO';
    } else if (method === 'CARD') {
      finalMethod = 'CARD';
    }

    const payment = await this.paymentService.create({
      orderId,
      method: finalMethod as any,
      status: orderStatus === 'DELIVERED' ? 'SUCCESS' : 'PENDING'
    }, ipAddr);

    return payment;
  }

  private async clearUserCartIfNeeded(
    userId: number | null,
    dto: CreateOrderDto,
  ) {
    if (userId && (!dto.items || dto.items.length === 0)) {
      await this.repository.clearUserCart(userId);
    }
  }

  private async sendConfirmationEmail(order: any) {
    const emailData = OrderHelper.prepareOrderEmailDetails(order);
    if (emailData.customerEmail && order.orderCode) {
      this.mailService
        .sendOrderConfirmation(
          emailData.customerEmail,
          order.orderCode,
          emailData.orderDetails,
        )
        .catch((err) => {
          this.logger.error('Failed to send confirmation email:', err);
        });
    }
  }
}
