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

@Injectable()
export class CartService {
  constructor(
    private repository: CartRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCart(userId: number): Promise<any> {
    console.log('📋 getCart called for userId:', userId);
    
    const cacheKey = `cart:${userId}`;
    // Fix: Thêm | undefined để match cache.get (TS2322)
    let cart:
      | (Cart & { cartItems: (CartItem & { variant: ProductVariant })[] })
      | null
      | undefined = await this.cacheManager.get(cacheKey);

    if (cart) {
      console.log('✅ Cart from cache:', { cartId: cart.id, itemsCount: cart.cartItems.length });
      const total = cart.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.variant.price,
        0,
      );
      return { ...cart, total };
    }
    
    cart = await this.repository.findByUserId(userId);
    console.log('📦 Cart from DB:', cart ? { cartId: cart.id, itemsCount: cart.cartItems.length } : 'NOT FOUND');

    if (!cart) throw new NotFoundException('Cart not found');

    const total = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.variant.price,
      0,
    ); // Giờ price typed đúng
    const cartWithTotal = { ...cart, total };

    await this.cacheManager.set(cacheKey, cartWithTotal, 300);
    console.log('💾 Cart cached with total:', total);
    
    return cartWithTotal;
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<any> {
    console.log('🛒 addItem called:', { userId, variantId: dto.variantId, quantity: dto.quantity });
    
    const variant = await this.repository.findVariantById(dto.variantId);
    console.log('📦 Variant found:', variant ? { id: variant.id, stock: variant.stock } : 'NOT FOUND');
    
    if (!variant || variant.stock < dto.quantity)
      throw new BadRequestException('Insufficient stock');
      
    let cart = await this.repository.upsertCart(userId);
    console.log('🛒 Cart upserted:', { cartId: cart.id, userId: cart.userId });
    
    const existingItem = await this.repository.findCartItem(cart.id, dto.variantId);
    console.log('🔍 Existing item:', existingItem ? { id: existingItem.id, quantity: existingItem.quantity } : 'NONE');
    
    let updatedItem;
    if (existingItem) {
      updatedItem = await this.repository.updateCartItem(
        existingItem.id,
        existingItem.quantity + dto.quantity,
      );
      console.log('✅ Updated existing item:', { id: updatedItem.id, newQuantity: updatedItem.quantity });
    } else {
      updatedItem = await this.repository.createCartItem({
        cart: { connect: { id: cart.id } },
        variant: { connect: { id: dto.variantId } },
        quantity: dto.quantity,
      });
      console.log('✅ Created new item:', { id: updatedItem.id, quantity: updatedItem.quantity });
    }

    await this.cacheManager.del(`cart:${userId}`);
    console.log('🗑️ Cache cleared for user:', userId);
    
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
    const updatedItem = await this.repository.updateCartItem(item.id, dto.quantity!);

    await this.cacheManager.del(`cart:${userId}`);
    return updatedItem;
  }

  async removeItem(userId: number, dto: RemoveCartItemDto): Promise<any> {
    console.log('🗑️ removeItem called:', { userId, variantId: dto.variantId });
    
    const cart = await this.repository.findByUserId(userId);
    if (!cart) {
      console.log('❌ Cart not found for user:', userId);
      throw new NotFoundException('Cart not found');
    }
    
    console.log('🛒 Cart found:', { cartId: cart.id, itemsCount: cart.cartItems.length });
    
    // Check if item exists before deleting
    const existingItem = await this.repository.findCartItem(cart.id, dto.variantId);
    if (!existingItem) {
      console.log('⚠️ Item not found in cart:', { cartId: cart.id, variantId: dto.variantId });
      // Return success even if item doesn't exist (idempotent delete)
      await this.cacheManager.del(`cart:${userId}`);
      return { message: 'Item already removed or does not exist' };
    }
    
    console.log('📦 Item found, deleting:', { itemId: existingItem.id, variantId: dto.variantId });
    const removedItem = await this.repository.deleteCartItem(cart.id, dto.variantId);
    console.log('✅ Item removed successfully');

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
}
