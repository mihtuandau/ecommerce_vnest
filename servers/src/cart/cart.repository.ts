import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, Prisma } from '@prisma/client';


@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  
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

  
  async upsertCart(userId: number): Promise<Cart> {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  
  async findVariantById(variantId: number) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
  }

  
  async findCartItem(cartId: number, variantId: number): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });
  }

  
  async createCartItem(data: Prisma.CartItemCreateInput): Promise<CartItem> {
    return this.prisma.cartItem.create({ data });
  }

  
  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  
  async deleteCartItem(cartId: number, variantId: number): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });
  }

  
  async deleteAllCartItems(cartId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}






