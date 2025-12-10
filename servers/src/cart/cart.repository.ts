import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, Prisma } from '@prisma/client';

/**
 * Repository pattern for Cart data access
 * Handles all database queries related to carts and cart items
 */
@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Find cart by user ID with all items and variants
   */
  async findByUserId(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find or create cart for user
   */
  async upsertCart(userId: number): Promise<Cart> {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  /**
   * Find product variant by ID
   */
  async findVariantById(variantId: number) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
  }

  /**
   * Find cart item by cart and variant
   */
  async findCartItem(cartId: number, variantId: number): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });
  }

  /**
   * Create a new cart item
   */
  async createCartItem(data: Prisma.CartItemCreateInput): Promise<CartItem> {
    return this.prisma.cartItem.create({ data });
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  /**
   * Delete cart item
   */
  async deleteCartItem(cartId: number, variantId: number): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });
  }

  /**
   * Delete all cart items for a cart
   */
  async deleteAllCartItems(cartId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
