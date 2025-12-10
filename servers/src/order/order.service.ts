import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { CartService } from '../cart/cart.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
    const existing = await this.prisma.order.findUnique({
      where: { orderCode: code }
    });
    
    // Recursively generate new code if exists
    if (existing) {
      return this.generateOrderCode();
    }
    
    return code;
  }

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
    // Get items from dto OR cart
    let itemsToOrder;
    if (dto.items && dto.items.length > 0) {
      // Guest checkout or direct order - items from request body
      const variantIds = dto.items.map(item => item.variantId);
      const variants = await this.prisma.productVariant.findMany({
        where: { id: { in: variantIds } }
      });
      
      const variantPriceMap = new Map(variants.map(v => [v.id, v.price]));
      
      itemsToOrder = dto.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: variantPriceMap.get(item.variantId) || 0
      }));
    } else {
      // Logged-in user checkout from cart
      if (!userId) {
        throw new BadRequestException('Guest checkout requires items in request body');
      }
      const cart = await this.cartService.getCart(userId);
      if (cart.cartItems.length === 0)
        throw new BadRequestException('Cart empty');
      itemsToOrder = cart.cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price
      }));
    }

    let discount: any = null;
    if (dto.discountCode) {
      discount = await this.prisma.discount.findUnique({
        where: { code: dto.discountCode },
      });
      if (!discount || discount.endDate < new Date())
        throw new BadRequestException('Invalid discount');
    }

    const totalItems = itemsToOrder.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const taxAmount = 0; // Remove VAT tax
    const total = totalItems; // No tax added
    let discountedTotal = total;
    if (discount) {
      if (discount.percentage) discountedTotal *= 1 - discount.percentage / 100;
      else if (discount.fixedAmount) discountedTotal -= discount.fixedAmount;
    }

    // Generate unique order code
    const orderCode = await this.generateOrderCode();

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

    const order = await this.prisma.order.create({
      data: orderData,
      include: { 
        orderItems: { 
          include: { 
            variant: { 
              include: { product: true, images: true } 
            } 
          } 
        }, 
        payment: true,
        user: true
      },
    });

    // Only clear cart if items were from cart (not from dto) and user is logged in
    if (userId && (!dto.items || dto.items.length === 0)) {
      await this.cartService.clearCart(userId);
    }
    
    if (userId) {
      await this.cacheManager.del(`orders:${userId}:all`);
    }

    // Send order confirmation email
    const customerEmail = order.guestEmail || order.user?.email;
    const customerName = order.shippingInfo?.['fullName'] || order.user?.name || 'Khách hàng';
    
    if (customerEmail) {
      const orderDetails = {
        customerName,
        items: order.orderItems.map(item => ({
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
    const { page = 1, limit = 10, status, userId } = query; // ✅ Fix: userId từ query (không error TS2339)
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where['status'] = status;
    if (userId) where['userId'] = userId; // ✅ Optional filter

    const [ordersData, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: { 
              variant: { 
                include: { 
                  product: true,
                  images: true
                } 
              } 
            },
          },
          payment: true,
          address: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const orders = {
      orders: ordersData,
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
      return order;
    }

    order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { 
          include: { 
            variant: { 
              include: { 
                product: true,
                images: true
              } 
            } 
          } 
        },
        payment: true,
        address: true,
        discount: true,
        user: true
      },
    });

    if (order) {
      await this.cacheManager.set(cacheKey, order, 1800);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    const oldOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { variant: true } } },
    });

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const order = await this.prisma.order.update({ where: { id }, data: dto });

    // Nếu status thay đổi sang DELIVERED, cập nhật soldCount
    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      for (const item of oldOrder.orderItems) {
        await this.prisma.product.update({
          where: { id: item.variant.productId },
          data: {
            soldCount: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return order;
  }

  async remove(id: number): Promise<any> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    const removed = await this.prisma.order.delete({ where: { id } });
    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return removed;
  }

  async cancelOrder(orderId: number, userId: number): Promise<any> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Not your order');
    if (order.status !== 'PENDING') throw new BadRequestException('Can only cancel PENDING orders');

    const cancelled = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: {
        orderItems: { include: { variant: { include: { product: true } } } },
        user: true
      }
    });

    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del(`orders:${userId}:all`);

    return cancelled;
  }

  async applyDiscount(orderId: number, dto: ApplyDiscountDto): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    const discount = await this.prisma.discount.findUnique({
      where: { code: dto.code },
    });
    if (!discount) throw new BadRequestException('Invalid discount');
    const newTotal =
      order.total * (1 - (discount.percentage || 0) / 100) -
      (discount.fixedAmount || 0);
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { total: newTotal, discountId: discount.id },
    });
    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);

    return { message: 'Discount applied', discount, updatedOrder };
  }

  async lookupGuestOrder(orderCode: string, contact: string): Promise<any> {
    const order: any = await this.prisma.order.findUnique({
      where: { orderCode: orderCode },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
                images: true,
              },
            },
          },
        },
        payment: true,
        discount: true,
      },
    });

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
