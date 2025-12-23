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
    
    const cacheKey = `cart:${userId}`;
    let cart:
      | (Cart & { cartItems: (CartItem & { variant: ProductVariant })[] })
      | null
      | undefined = await this.cacheManager.get(cacheKey);

    if (cart) {
      const total = cart.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.variant.price,
        0,
      );
      return { ...cart, total };
    }
    
    cart = await this.repository.findByUserId(userId);

    if (!cart) throw new NotFoundException('Cart not found');

    const total = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.variant.price,
      0,
    );
    const cartWithTotal = { ...cart, total };

    await this.cacheManager.set(cacheKey, cartWithTotal, 300);
    
    return cartWithTotal;
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<any> {
    
    const variant = await this.repository.findVariantById(dto.variantId);
    
    if (!variant || variant.stock < dto.quantity)
      throw new BadRequestException('Insufficient stock');
      
    let cart = await this.repository.upsertCart(userId);
    
    const existingItem = await this.repository.findCartItem(cart.id, dto.variantId);
    
    let updatedItem;
    if (existingItem) {
      updatedItem = await this.repository.updateCartItem(
        existingItem.id,
        existingItem.quantity + dto.quantity,
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
    const updatedItem = await this.repository.updateCartItem(item.id, dto.quantity!);

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
}
