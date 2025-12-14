import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { CartService } from '../cart/cart.service';
import { MailService } from '../mail/mail.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private repository: OrderRepository,
    private cartService: CartService,
    private mailService: MailService,
    private paymentService: PaymentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Helper to serialize order (convert BigInt in payment to Number)
  private serializeOrder(order: any) {
    if (!order) return null;
    
    // If order has payment relation, serialize payment BigInt fields
    if (order.payment) {
      return {
        ...order,
        payment: {
          ...order.payment,
          payosOrderCode: order.payment.payosOrderCode 
            ? Number(order.payment.payosOrderCode) 
            : null,
        },
      };
    }
    
    return order;
  }

  // Generate unique order code
  private async generateOrderCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Generate format: ORD-XXXXXX (ORD + 6 random chars)
    code = 'ORD-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists
    const existing = await this.repository.findByCode(code);
    
    // Recursively generate new code if exists
    if (existing) {
      return this.generateOrderCode();
    }
    
    return code;
  }

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
    console.log('🛒 Order.create called:', { userId, dtoItemsCount: dto.items?.length, discountCode: dto.discountCode });
    
    // Get items from dto OR cart
    let itemsToOrder;
    if (dto.items && dto.items.length > 0) {
      // Guest checkout or direct order - items from request body
      console.log('📦 Using items from request body:', dto.items);
      const variantIds = dto.items.map(item => item.variantId);
      const variants = await this.repository.findVariantsByIds(variantIds);
      
      if (!variants || variants.length === 0) {
        throw new BadRequestException('Không tìm thấy sản phẩm');
      }
      
      console.log('✅ Found variants:', variants.map(v => ({ id: v.id, price: v.price })));
      
      const variantPriceMap = new Map(variants.map(v => [v.id, v.price]));
      
      itemsToOrder = dto.items.map(item => {
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
    } else {
      // Logged-in user checkout from cart
      console.log('🛍️ Using items from user cart');
      if (!userId) {
        throw new BadRequestException('Guest checkout requires items in request body');
      }
      const cart = await this.cartService.getCart(userId);
      console.log('📦 User cart items:', cart.cartItems?.length);
      
      if (!cart.cartItems || cart.cartItems.length === 0) {
        throw new BadRequestException('Giỏ hàng trống');
      }
      
      itemsToOrder = cart.cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant?.price || 0
      }));
    }
    
    console.log('✅ Items to order:', itemsToOrder);
    

    let discount: any = null;
    if (dto.discountCode) {
      console.log('🏷️ Validating discount code:', dto.discountCode);
      discount = await this.repository.findDiscountByCode(dto.discountCode);
      console.log('💰 Discount found:', discount);
      
      if (!discount) {
        throw new BadRequestException('Mã giảm giá không tồn tại');
      }
      
      if (discount.endDate && discount.endDate < new Date()) {
        throw new BadRequestException('Mã giảm giá đã hết hạn');
      }
      
      console.log('✅ Discount valid:', { percentage: discount.percentage, fixedAmount: discount.fixedAmount });
    } else {
      console.log('⚠️ No discount code provided');
    }

    const totalItems = itemsToOrder.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    console.log('💰 Calculation:', { totalItems, shippingFee: dto.shippingFee });
    
    const taxAmount = 0; // Remove VAT tax
    const shippingFee = dto.shippingFee || 0; // Phí vận chuyển
    const total = totalItems + shippingFee; // Items + shipping
    
    console.log('📊 Before discount:', { totalItems, shippingFee, total });
    
    // Apply discount to total (items + shipping)
    let discountedTotal = total;
    if (discount) {
      if (discount.percentage) {
        discountedTotal *= 1 - discount.percentage / 100;
        console.log(`💸 Applied ${discount.percentage}% discount:`, { before: total, after: discountedTotal });
      }
      else if (discount.fixedAmount) {
        discountedTotal -= discount.fixedAmount;
        console.log(`💸 Applied ${discount.fixedAmount}đ fixed discount:`, { before: total, after: discountedTotal });
      }
    }
    
    console.log('✅ Final total:', discountedTotal);

    // Generate unique order code
    const orderCode = await this.generateOrderCode();
    console.log('📝 Generated order code:', orderCode);

    const orderData: any = {
      orderCode,
      addressId: dto.addressId || null,
      shippingMethodId: dto.shippingMethodId || null,
      shippingAddress: dto.shippingAddress || null,
      shippingInfo: dto.shippingInfo || null,
      guestEmail: dto.guestEmail || null,
      guestPhone: dto.guestPhone || null,
      paymentMethod: (dto.paymentMethod as any) || 'CASH',
      total: discountedTotal,
      taxAmount,
      discountId: discount ? discount.id : null,
      status: 'PENDING',
      orderItems: {
        create: itemsToOrder.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    // Only add userId if user is logged in
    if (userId) {
      orderData.userId = userId;
    }

    const order = await this.repository.create(orderData);

    // Create payment record immediately after order creation
    try {
      await this.paymentService.create({
        orderId: order.id,
        method: (dto.paymentMethod as any) || 'CASH',
      });
    } catch (error) {
      console.error('Failed to create payment record:', error);
      // Continue even if payment creation fails
    }

    // Only clear cart if items were from cart (not from dto) and user is logged in
    if (userId && (!dto.items || dto.items.length === 0)) {
      await this.repository.clearUserCart(userId);
    }
    
    if (userId) {
      await this.cacheManager.del(`orders:${userId}:all`);
    }

    // Send order confirmation email
    const customerEmail = order.guestEmail || (order as any).user?.email;
    const customerName = order.shippingInfo?.['fullName'] || (order as any).user?.name || 'Khách hàng';
    
    if (customerEmail) {
      const orderDetails = {
        customerName,
        items: (order as any).orderItems.map(item => ({
          productName: item.variant?.product?.name || 'N/A',
          size: item.variant?.size,
          color: item.variant?.color,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        shippingAddress: order.shippingAddress || 'N/A',
      };

      // Send email asynchronously (don't wait)
      const orderWithCode = order as any;
      if (orderWithCode.orderCode) {
        this.mailService.sendOrderConfirmation(
          customerEmail,
          orderWithCode.orderCode,
          orderDetails,
        ).catch(err => {
          // Silent error - email sending is optional
        });
      }
    }

    return order;
  }

  // src/order/order.service.ts (sửa where clause với userId)
  async findAll(query: QueryOrderDto) {
    const { page = 1, limit = 10, status, userId } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where['status'] = status;
    if (userId) where['userId'] = userId;

    const [ordersData, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    // Serialize all orders with payment data
    const serializedOrders = ordersData.map(order => this.serializeOrder(order));

    const orders = {
      orders: serializedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    const cacheKey = `orders:${JSON.stringify(query)}`;
    await this.cacheManager.set(cacheKey, orders, 3600);

    return orders;
  }

  async findOne(id: number): Promise<any> {
    const cacheKey = `order:${id}`;
    let order = await this.cacheManager.get(cacheKey);
    if (order) {
      return this.serializeOrder(order);
    }

    order = await this.repository.findById(id);

    if (order) {
      await this.cacheManager.set(cacheKey, order, 1800);
    }

    return this.serializeOrder(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    const oldOrder = await this.repository.findById(id);

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const order = await this.repository.update(id, dto);

    // Tạo payment record nếu chưa có và status được cập nhật
    if (dto.status && !oldOrder.payment) {
      try {
        await this.paymentService.create({
          orderId: order.id,
          method: order.paymentMethod as any,
        });
        console.log(`✅ Created payment for order ${order.id}`);
      } catch (error) {
        console.error('Failed to create payment record:', error);
      }
    }

    // Nếu status thay đổi sang DELIVERED, cập nhật soldCount
    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      for (const item of oldOrder.orderItems) {
        await this.repository.incrementProductSoldCount(item.variant.productId, item.quantity);
      }
    }

    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return order;
  }

  async remove(id: number): Promise<any> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    const removed = await this.repository.delete(id);
    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return removed;
  }

  async cancelOrder(orderId: number, userId: number): Promise<any> {
    const order = await this.repository.findById(orderId);
    
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Not your order');
    if (order.status !== 'PENDING') throw new BadRequestException('Can only cancel PENDING orders');

    const cancelled = await this.repository.update(orderId, { status: 'CANCELLED' });

    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del(`orders:${userId}:all`);

    return cancelled;
  }

  async applyDiscount(orderId: number, dto: ApplyDiscountDto): Promise<any> {
    const order = await this.repository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const discount = await this.repository.findDiscountByCode(dto.code);
    if (!discount) throw new BadRequestException('Invalid discount');
    const newTotal =
      order.total * (1 - (discount.percentage || 0) / 100) -
      (discount.fixedAmount || 0);
    const updatedOrder = await this.repository.update(orderId, {
      total: newTotal,
      discount: { connect: { id: discount.id } },
    });
    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return { message: 'Discount applied', discount, updatedOrder };
  }

  async lookupGuestOrder(orderCode: string, contact: string): Promise<any> {
    const order: any = await this.repository.findByCode(orderCode);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if it's a guest order (no userId)
    if (order.userId) {
      throw new BadRequestException('This order requires login to view');
    }

    // Verify contact information (email or phone)
    const contactMatch =
      order.guestEmail === contact || order.guestPhone === contact;

    if (!contactMatch) {
      throw new BadRequestException('Contact information does not match');
    }

    return order;
  }
}
