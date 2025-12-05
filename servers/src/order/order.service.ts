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

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(userId: number, dto: CreateOrderDto): Promise<any> {
    // Get items from dto OR cart
    let itemsToOrder;
    if (dto.items && dto.items.length > 0) {
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
    const taxAmount = totalItems * 0.1;
    const total = totalItems + taxAmount;
    let discountedTotal = total;
    if (discount) {
      if (discount.percentage) discountedTotal *= 1 - discount.percentage / 100;
      else if (discount.fixedAmount) discountedTotal -= discount.fixedAmount;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: dto.addressId || null,
        shippingMethodId: dto.shippingMethodId || null,
        shippingAddress: dto.shippingAddress || null,
        shippingInfo: dto.shippingInfo || null,
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
      },
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

    // Only clear cart if items were from cart (not from dto)
    if (!dto.items || dto.items.length === 0) {
      await this.cartService.clearCart(userId);
    }
    
    await this.cacheManager.del(`orders:${userId}:all`);
    console.log(`Cache invalidated for orders of user ${userId} after create`);

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
      console.log(`Single cache hit for order ${id}`);
      return order;
    }

    console.log(`Single cache miss for order ${id} - querying DB`);

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
      console.log(`Single cache set for order ${id}`);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    const order = await this.prisma.order.update({ where: { id }, data: dto });
    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);
    console.log(`Cache invalidated for order ${id} after update`);

    return order;
  }

  async remove(id: number): Promise<any> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    const removed = await this.prisma.order.delete({ where: { id } });
    await this.cacheManager.del(`order:${id}`);
    await this.cacheManager.del(`orders:${order.userId}:all`);
    console.log(`Cache invalidated for order ${id} after remove`);

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
    console.log(`Cache invalidated for order ${orderId} after cancel`);

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
    console.log(`Cache invalidated for order ${orderId} after apply discount`);

    return { message: 'Discount applied', discount, updatedOrder };
  }
}
