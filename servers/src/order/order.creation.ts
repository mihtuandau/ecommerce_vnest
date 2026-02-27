// src/order/order.creation.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as OrderHelper from './order.helper';

@Injectable()
export class OrderCreation {
  private readonly logger = new Logger(OrderCreation.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private cartService: CartService,
    private paymentService: PaymentService,
    private mailService: MailService,
  ) {}

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
    this.logger.log('🛒 Order creation started', { userId, itemsCount: dto.items?.length, discountCode: dto.discountCode });

    // Get items to order
    const itemsToOrder = await this.getItemsToOrder(userId, dto);
    this.logger.log('✅ Items to order prepared', itemsToOrder);

    // Validate and get discount
    const discount = await this.validateDiscount(dto.discountCode);

    // Calculate totals
    const discountData = discount ? {
      percentage: discount.percentage || undefined,
      fixedAmount: discount.fixedAmount || undefined
    } : undefined;
    const totals = OrderHelper.calculateOrderTotal(itemsToOrder, dto.shippingFee, discountData);
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
      itemsToOrder, 
      totals.discountedTotal, 
      discount
    );

    // Create order with atomic stock check + decrement (prevents overselling)
    const order = await this.repository.createOrderTransactional(orderData, itemsToOrder) as any;
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
    const variants = await this.repository.findVariantsByIds(variantIds);
    
    if (!variants || variants.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }
    
    this.logger.log('✅ Found variants:', variants.map(v => ({ id: v.id, price: v.price })));
    
    const variantPriceMap = new Map(variants.map(v => [v.id, v.price]));
    
    return items.map(item => {
      const price = variantPriceMap.get(item.variantId);
      if (!price && price !== 0) {
        throw new BadRequestException(`Sản phẩm ID ${item.variantId} không tồn tại`);
      }
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price
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
      price: item.variant?.price || 0
    }));
  }

  private async validateDiscount(discountCode?: string) {
    if (!discountCode) {
      this.logger.log('⚠️ No discount code provided');
      return null;
    }

    this.logger.log('🏷️ Validating discount code:', discountCode);
    const discount = await this.repository.findDiscountByCode(discountCode);
    
    if (!discount) {
      throw new BadRequestException('Mã giảm giá không tồn tại');
    }
    
    OrderHelper.validateDiscount(discount);
    this.logger.log('✅ Discount valid:', { percentage: discount.percentage, fixedAmount: discount.fixedAmount });
    
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