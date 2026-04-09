// src/order/order.creation.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as OrderHelper from './order.helper';
import { PrismaService } from '../prisma/prisma.service';

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
  ) {}

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
    this.logger.log('🛒 Order creation started', { userId, itemsCount: dto.items?.length, discountCode: dto.discountCode });

    // Get items to order
    const itemsToOrder = await this.getItemsToOrder(userId, dto);
    this.logger.log('✅ Items to order prepared', itemsToOrder);

    // Apply per-item auto-apply discounts (flash sale / product-specific)
    const variantIds = itemsToOrder.map((i) => i.variantId);
    const autoDiscountPriceMap = await this.repository.findAutoApplyPricesForVariants(variantIds);
    const itemsWithDiscounts = itemsToOrder.map((item) => ({
      ...item,
      price: autoDiscountPriceMap.get(item.variantId) ?? item.price,
    }));
    if (autoDiscountPriceMap.size > 0) {
      this.logger.log('💡 Auto-apply discounts applied to items:', Object.fromEntries(autoDiscountPriceMap));
    }

    // So sánh auto-apply saving vs manual code saving — chọn cái mang lại lợi ích cao hơn (không stack)
    const originalSubtotal = itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const autoApplySubtotal = itemsWithDiscounts.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const autoApplySaving = originalSubtotal - autoApplySubtotal;

    // Validate manual code dựa trên giá gốc (minOrderAmount so với original subtotal)
    const discount = await this.validateDiscount(dto.discountCode, originalSubtotal);

    // Tính tiết kiệm từ manual code áp lên original subtotal
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

    // Best-wins: dùng auto-apply nếu tiết kiệm nhiều hơn hoặc bằng manual code
    const useAutoApply = autoApplySaving >= manualCodeSaving;
    const finalItems = useAutoApply ? itemsWithDiscounts : itemsToOrder;
    const finalDiscount = useAutoApply ? null : discount;
    this.logger.log(`💡 Discount decision: autoApply=${autoApplySaving}, manualCode=${manualCodeSaving}, using=${useAutoApply ? 'AUTO-APPLY' : 'MANUAL-CODE'}`);

    // Calculate totals
    const discountData = finalDiscount ? {
      percentage: finalDiscount.percentage || undefined,
      fixedAmount: finalDiscount.fixedAmount || undefined,
      maxDiscountAmount: finalDiscount.maxDiscountAmount || undefined,
    } : undefined;
    const totals = OrderHelper.calculateOrderTotal(finalItems, dto.shippingFee, discountData);
    this.logger.log('💰 Order totals calculated', totals);

    // Generate order code
    const orderCode = await OrderHelper.generateOrderCode(
      (code) => this.repository.findByCode(code)
    );
    this.logger.log('📝 Generated order code:', orderCode);

    // Prepare order data
    const orderData = OrderHelper.prepareOrderData(
      orderCode, 
      userId, 
      dto, 
      finalItems, 
      { 
        subtotal: totals.totalItems, 
        discountAmount: totals.discountAmount, 
        total: totals.discountedTotal 
      }, 
      finalDiscount
    );

    // Create order with atomic stock check + decrement (prevents overselling)
    const order = await this.repository.createOrderTransactional(orderData, finalItems) as any;
    this.logger.log('✅ Order created with ID:', order.id);
    this.logger.log('📧 Guest email for order:', order.guestEmail);
    this.logger.log('👤 User email for order:', order.user?.email);

    // Create payment record
    await this.createPaymentRecord(order.id, dto.paymentMethod);

    // Clear user cart if needed
    await this.clearUserCartIfNeeded(userId, dto);

    // Clear cache
    if (userId) {
      await this.cacheService.deleteUserOrderCaches(userId);
    }

    // Send confirmation email
    await this.sendConfirmationEmail(order);

    return order;
  }

  private async getItemsToOrder(userId: number | null, dto: CreateOrderDto) {
    if (dto.items && dto.items.length > 0) {
      // Guest checkout or direct order - items from request body
      this.logger.log('📦 Using items from request body');
      return await this.prepareItemsFromDto(dto.items);
    } else {
      // Logged-in user checkout from cart
      this.logger.log('🛍️ Using items from user cart');
      if (!userId) {
        throw new BadRequestException('Guest checkout requires items in request body');
      }
      return await this.prepareItemsFromCart(userId);
    }
  }

  private async prepareItemsFromDto(items: Array<{variantId: number, quantity: number}>) {
    const variantIds = items.map(item => item.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true } } }
    });
    
    if (!variants || variants.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }
    
    this.logger.log('✅ Found variants:', variants.map(v => ({ id: v.id, price: v.price, name: v.product?.name })));
    
    const variantMap = new Map(variants.map(v => [v.id, v]));
    
    return items.map(item => {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new BadRequestException(`Sản phẩm ID ${item.variantId} không tồn tại`);
      }
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price,
        productName: variant.product?.name || 'Sản phẩm'
      };
    });
  }

  private async prepareItemsFromCart(userId: number) {
    const cart = await this.cartService.getCart(userId);
    this.logger.log('📦 User cart items count:', cart.cartItems?.length);
    
    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }
    
    return cart.cartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.variant?.price || 0,
      productName: item.variant?.product?.name || 'Sản phẩm'
    }));
  }

  private async validateDiscount(discountCode?: string, subtotal?: number) {
    if (!discountCode) {
      this.logger.log('⚠️ No discount code provided');
      return null;
    }

    this.logger.log('🏷️ Validating discount code:', discountCode);
    const discount = await this.repository.findDiscountByCode(discountCode);

    if (!discount) {
      throw new BadRequestException('Mã giảm giá không tồn tại');
    }

    // Flash sale chỉ áp tự động theo product, không dùng qua mã thủ công
    if (discount.isFlashSale) {
      throw new BadRequestException('Mã Flash Sale đã được áp dụng tự động, không cần nhập thêm');
    }

    const usageCount = await this.repository.countOrdersUsingDiscount(discount.id);

    // Validate đầy đủ: isActive, startDate, endDate, minOrderAmount
    OrderHelper.validateDiscount(discount, subtotal, usageCount);
    this.logger.log('✅ Discount valid:', {
      percentage: discount.percentage,
      fixedAmount: discount.fixedAmount,
      maxDiscountAmount: discount.maxDiscountAmount,
    });

    return discount;
  }

  private async createPaymentRecord(orderId: number, paymentMethod?: string) {
    try {
      await this.paymentService.create({
        orderId,
        method: (paymentMethod as any) || 'CASH',
      });
      this.logger.log('✅ Payment record created for order:', orderId);
    } catch (error) {
      this.logger.error('Failed to create payment record:', error);
      // Continue even if payment creation fails
    }
  }

  private async clearUserCartIfNeeded(userId: number | null, dto: CreateOrderDto) {
    // Only clear cart if items were from cart (not from dto) and user is logged in
    if (userId && (!dto.items || dto.items.length === 0)) {
      await this.repository.clearUserCart(userId);
      this.logger.log('🗑️ User cart cleared');
    }
  }

  private async sendConfirmationEmail(order: any) {
    this.logger.log('📧 Preparing email for order:', { 
      orderCode: order.orderCode, 
      guestEmail: order.guestEmail,
      userEmail: order.user?.email 
    });
    
    const emailData = OrderHelper.prepareOrderEmailDetails(order);
    
    this.logger.log('📧 Email data prepared:', { 
      customerEmail: emailData.customerEmail,
      orderCode: order.orderCode 
    });
    
    if (emailData.customerEmail && order.orderCode) {
      this.mailService.sendOrderConfirmation(
        emailData.customerEmail,
        order.orderCode,
        emailData.orderDetails,
      ).catch(err => {
        this.logger.error('Failed to send confirmation email:', err);
        // Silent error - email sending is optional
      });
      this.logger.log('📧 Confirmation email queued for:', emailData.customerEmail);
    } else {
      this.logger.warn('⚠️ No customer email found, skipping confirmation email');
    }
  }
} 