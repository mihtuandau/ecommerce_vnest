import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CartRepository } from './cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { Prisma, Cart, CartItem, ProductVariant } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(
    private repository: CartRepository,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    console.log('[CartService] Initialized');
  }

  async getCart(userId: number): Promise<any> {
    const cacheKey = `cart:${userId}`;
    let cart: any = await this.cacheManager.get(cacheKey);

    if (!cart) {
      cart = await this.repository.upsertCart(userId);
    }

    // Fetch active automatic discounts (Flash Sales)
    const now = new Date();
    const activeDiscounts = await this.prisma.discount.findMany({
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

    const calculateDiscount = (item: any) => {
      const variant = item.variant;
      if (!variant) return item.variant?.price || 0;
      
      const discountedPrice = require('../common/utils/discount.util').calculateDiscountedPrice(
        { ...variant, product: { categoryId: variant.product?.categoryId } },
        activeDiscounts
      );
      return discountedPrice;
    };

    // Filter items and calculate totals with real-time pricing
    const processedItems = (cart.cartItems || [])
      .filter((item: any) => item && item.variant && item.variant.isActive && item.variant.product && !item.variant.product.deletedAt)
      .map((item: any) => {
        const discountedPrice = calculateDiscount(item);
        return {
          ...item,
          discountedPrice,
          subtotal: item.quantity * discountedPrice
        };
      });

    const total = processedItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const cartWithTotal = { ...cart, cartItems: processedItems, total };

    await this.cacheManager.set(cacheKey, cartWithTotal, 300 * 1000); // 5 minutes in ms
    return cartWithTotal;
  }

  async sync(userId: number, items: Array<{ variantId: number; quantity: number }>): Promise<any> {
    const cart = await this.repository.upsertCart(userId);
    
    if (items.length > 0) {
      for (const item of items) {
        try {
          const existingItem = await this.repository.findCartItem(cart.id, item.variantId);
          if (existingItem) {
            // Merge: Add quantities
            await this.repository.updateCartItem(
              existingItem.id,
              existingItem.quantity + item.quantity
            );
          } else {
            // New item
            const variant = await this.repository.findVariantById(item.variantId);
            if (variant && variant.isActive && variant.stock >= item.quantity) {
              await this.repository.createCartItem({
                cart: { connect: { id: cart.id } },
                variant: { connect: { id: item.variantId } },
                quantity: item.quantity,
              });
            }
          }
        } catch (error) {
          // Skip invalid variants or other errors during sync
        }
      }
    }

    await this.cacheManager.del(`cart:${userId}`);
    return this.getCart(userId);
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<any> {
    
    const variant = await this.repository.findVariantById(dto.variantId);
    
    if (!variant || !variant.isActive || variant.stock < dto.quantity) {
      throw new BadRequestException('Product unavailable or insufficient stock');
    }
      
    let cart = await this.repository.upsertCart(userId);
    
    const existingItem = await this.repository.findCartItem(cart.id, dto.variantId);
    
    let updatedItem;
    if (existingItem) {
      const totalRequested = existingItem.quantity + dto.quantity;
      if (variant.stock < totalRequested) {
        throw new BadRequestException(`Insufficient stock. You already have ${existingItem.quantity} in cart, and the warehouse only has ${variant.stock} left.`);
      }
      updatedItem = await this.repository.updateCartItem(
        existingItem.id,
        totalRequested,
      );
    } else {
      updatedItem = await this.repository.createCartItem({
        cart: { connect: { id: cart.id } },
        variant: { connect: { id: dto.variantId } },
        quantity: dto.quantity,
      });
    }

    await this.cacheManager.del(`cart:${userId}`);
    
    return updatedItem;
  }

  async updateItem(
    userId: number,
    variantId: number,
    dto: UpdateCartItemDto,
  ): Promise<any> {
    const cart = await this.repository.findByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');
    const item = await this.repository.findCartItem(cart.id, variantId);
    if (!item) throw new NotFoundException('Item not found');

    if (dto.quantity !== undefined && dto.quantity <= 0) {
      return this.removeItem(userId, { variantId });
    }
    const updatedItem = await this.repository.updateCartItem(item.id, dto.quantity ?? item.quantity);

    await this.cacheManager.del(`cart:${userId}`);
    return updatedItem;
  }

  async removeItem(userId: number, dto: RemoveCartItemDto): Promise<any> {
    
    const cart = await this.repository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    
    const existingItem = await this.repository.findCartItem(cart.id, dto.variantId);
    if (!existingItem) {
      await this.cacheManager.del(`cart:${userId}`);
      return { message: 'Item already removed or does not exist' };
    }
    
    const removedItem = await this.repository.deleteCartItem(cart.id, dto.variantId);

    await this.cacheManager.del(`cart:${userId}`);
    return removedItem;
  }

  async clearCart(userId: number): Promise<any> {
    const cart = await this.repository.findByUserId(userId);
    if (!cart) return;
    const cleared = await this.repository.deleteAllCartItems(cart.id);

    await this.cacheManager.del(`cart:${userId}`);
    return cleared;
  }

  /**
   * Validate checkout items - check if stock is still available
   * This should be called before submitting order to provide real-time stock info
   */
  async validateCheckoutItems(items: Array<{variantId: number, quantity: number}>) {
    const variantIds = items.map(item => item.variantId);
    const variants = await this.repository.findVariantsByIds(variantIds);
    
    const variantMap = new Map(variants.map(v => [v.id, v]));
    
    const validationResult = items.map(item => {
      const variant = variantMap.get(item.variantId);
      
      if (!variant) {
        return {
          variantId: item.variantId,
          requestedQuantity: item.quantity,
          availableStock: 0,
          canCheckout: false,
          reason: 'Sản phẩm không tồn tại'
        };
      }
      
      const canCheckout = variant.stock >= item.quantity;
      
      return {
        variantId: item.variantId,
        requestedQuantity: item.quantity,
        availableStock: variant.stock,
        canCheckout,
        reason: !canCheckout ? `Chỉ còn ${variant.stock} sản phẩm, bạn yêu cầu ${item.quantity}` : undefined
      };
    });
    
    const allCanCheckout = validationResult.every(r => r.canCheckout);
    
    return {
      valid: allCanCheckout,
      items: validationResult,
      message: allCanCheckout ? 'Tất cả sản phẩm có sẵn' : 'Một số sản phẩm không đủ số lượng'
    };
  }
}






