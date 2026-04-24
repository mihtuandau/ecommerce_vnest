
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

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
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
        price: (discountedPrice !== undefined && discountedPrice < item.price) ? discountedPrice : item.price,
      };
    });

    const originalSubtotal = itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const autoApplySubtotal = itemsWithDiscounts.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const autoApplySaving = originalSubtotal - autoApplySubtotal;

    // 3. Kiểm tra mã giảm giá thủ công (Voucher)
    const discount = await this.validateDiscount(dto.discountCode, originalSubtotal);
    let manualCodeSaving = 0;
    if (discount) {
      if (discount.percentage) {
        manualCodeSaving = Math.round(originalSubtotal * discount.percentage / 100);
      } else if (discount.fixedAmount) {
        manualCodeSaving = discount.fixedAmount;
      }
      if (discount.maxDiscountAmount && manualCodeSaving > discount.maxDiscountAmount) {
        manualCodeSaving = discount.maxDiscountAmount;
      }
      manualCodeSaving = Math.min(manualCodeSaving, originalSubtotal);
    }

    // 4. Quyết định dùng Flash Sale hay Voucher (cái nào lợi hơn cho khách)
    const useAutoApply = autoApplySaving > 0 && autoApplySaving >= manualCodeSaving;
    const finalItems = useAutoApply ? itemsWithDiscounts : itemsToOrder;
    const finalDiscount = useAutoApply ? null : discount;

    const discountData = finalDiscount ? {
      percentage: finalDiscount.percentage || undefined,
      fixedAmount: finalDiscount.fixedAmount || undefined,
      maxDiscountAmount: finalDiscount.maxDiscountAmount || undefined,
    } : {
      fixedAmount: useAutoApply ? autoApplySaving : 0
    };

    // 5. Tính phí vận chuyển qua GHN
    let ghnShippingFee = 30000; // Default fallback
    try {
      const shippingFeeResult = await this.calculateGHNFee(dto, finalItems);
      if (shippingFeeResult) {
        ghnShippingFee = shippingFeeResult;
      } else {
        // GHN calculation failed - either missing address or invalid input
        // Only use fallback if this is optional shipping (COD order)
        const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
        if (isOnlinePayment) {
          throw new BadRequestException(
            'Không thể tính phí vận chuyển. Vui lòng kiểm tra lại địa chỉ giao hàng.'
          );
        }
      }
    } catch (error) {
      // GHN service error - strict policy for online payments
      const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
      if (isOnlinePayment) {
        this.logger.error('GHN fee calculation failed for online payment:', error);
        throw new BadRequestException(
          'Không thể tính phí vận chuyển qua GHN. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
        );
      }
      // For COD, log warning but continue
      this.logger.warn('GHN fee calculation failed, using default:', error.message);
    }

    const totals = OrderHelper.calculateOrderTotal(finalItems, ghnShippingFee, finalDiscount ? discountData : undefined);

    const orderCode = await OrderHelper.generateOrderCode(
      (code) => this.repository.findByCode(code)
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
        total: totals.discountedTotal 
      }, 
      finalDiscount
    );

    const order = await this.repository.createOrderTransactional(
      orderData, 
      finalItems,
      finalDiscount?.id ?? undefined,
      finalDiscount?.usageLimit ?? undefined
    ) as any;

    await this.createPaymentRecord(order.id, dto.paymentMethod);
    await this.clearUserCartIfNeeded(userId, dto);

    if (userId) {
      await this.cacheService.deleteUserOrderCaches(userId);
    }

    await this.sendConfirmationEmail(order);
    return order;
  }

  private async getItemsToOrder(userId: number | null, dto: CreateOrderDto) {
    if (dto.items && dto.items.length > 0) {
      return await this.prepareItemsFromDto(dto.items);
    } else {
      if (!userId) {
        throw new BadRequestException('Guest checkout requires items in request body');
      }
      return await this.prepareItemsFromCart(userId);
    }
  }

  private async prepareItemsFromDto(items: Array<{variantId: number, quantity: number, price?: number}>) {
    const variantIds = items.map(item => item.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true, category: { select: { name: true } } } } }
    });
    
    if (!variants || variants.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }

    const variantMap = new Map(variants.map(v => [v.id, v]));
    
    return items.map(item => {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new BadRequestException(`Sản phẩm ID ${item.variantId} không tồn tại`);
      }
      
      // Validate price - if frontend provided expected price, check for significant changes
      if (item.price !== undefined && variant.price !== item.price) {
        const priceChange = Math.abs((variant.price - item.price) / item.price) * 100;
        // If price changed more than 10%, block order and request fresh price from client
        if (priceChange > 10) {
          this.logger.warn(
            `Significant price change detected for variant ${item.variantId}: ` +
            `expected ${item.price}, actual ${variant.price} (${priceChange.toFixed(2)}% change). Order blocked.`
          );
          throw new BadRequestException(
            `Giá sản phẩm đã thay đổi trên ${priceChange.toFixed(1)}%. ` +
            `Giá hiện tại: ${variant.price}đ (giá lúc trước: ${item.price}đ). ` +
            `Vui lòng tải lại giỏ hàng và thử lại.`
          );
        }
      }
      
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price, // Always use current database price, not frontend price
        productName: variant.product?.name || 'Sản phẩm',
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        category: variant.product?.category?.name
      };
    });
  }

  private async prepareItemsFromCart(userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }
    
    return cart.cartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.variant?.price || 0,
      productName: item.variant?.product?.name || 'Sản phẩm',
      weight: item.variant?.weight,
      length: item.variant?.length,
      width: item.variant?.width,
      height: item.variant?.height,
      category: item.variant?.product?.category?.name
    }));
  }

  private async calculateGHNFee(dto: CreateOrderDto, items: any[]) {
    let districtCode: string | null = null;
    let wardCode: string | null = null;

    if (dto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: dto.addressId }
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

    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 0);
    const maxLength = Math.max(...items.map(i => i.length || 10));
    const maxWidth = Math.max(...items.map(i => i.width || 10));
    const totalHeight = items.reduce((sum, i) => sum + (i.height || 5) * i.quantity, 0);

    const fromDistrictId = Number(this.configService.get('GHN_FROM_DISTRICT_ID'));
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
      coupon: null
    };

    const result = await this.ghnService.calculateFee(feeData);
    return result.data.total;
  }

  private async validateDiscount(discountCode?: string, subtotal?: number) {
    if (!discountCode) return null;
    const discount = await this.repository.findDiscountByCode(discountCode);
    if (!discount) throw new BadRequestException('Mã giảm giá không tồn tại');
    if (discount.isFlashSale) throw new BadRequestException('Mã Flash Sale đã được áp dụng tự động');

    const usageCount = await this.repository.countOrdersUsingDiscount(discount.id);
    OrderHelper.validateDiscount(discount, subtotal, usageCount);
    return discount;
  }

  private async createPaymentRecord(orderId: number, paymentMethod?: string) {
    try {
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
      
      await this.paymentService.create({
        orderId,
        method: finalMethod as any,
      });
    } catch (error) {
      this.logger.error('Failed to create payment record:', error);
    }
  }

  private async clearUserCartIfNeeded(userId: number | null, dto: CreateOrderDto) {
    if (userId && (!dto.items || dto.items.length === 0)) {
      await this.repository.clearUserCart(userId);
    }
  }

  private async sendConfirmationEmail(order: any) {
    const emailData = OrderHelper.prepareOrderEmailDetails(order);
    if (emailData.customerEmail && order.orderCode) {
      this.mailService.sendOrderConfirmation(
        emailData.customerEmail,
        order.orderCode,
        emailData.orderDetails,
      ).catch(err => {
        this.logger.error('Failed to send confirmation email:', err);
      });
    }
  }
}
