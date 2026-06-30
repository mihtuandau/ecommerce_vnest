import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ChatbotCartRequest = {
  variantId: number;
  quantity: number;
};

@Injectable()
export class ChatbotCartService {
  constructor(private prisma: PrismaService) {}

  async addVariantToCart(
    userId: number | undefined,
    request: ChatbotCartRequest | null,
  ) {
    if (!request) return null;
    if (!userId) {
      return {
        status: 'login_required',
        message: 'Bạn cần đăng nhập để mình thêm sản phẩm vào giỏ hàng.',
      };
    }

    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id: request.variantId,
        isActive: true,
        deletedAt: null,
        product: { isActive: true, deletedAt: null },
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!variant) {
      return {
        status: 'unavailable',
        message: 'Phiên bản sản phẩm này hiện không khả dụng.',
      };
    }

    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId: cart.id, variantId: variant.id },
      },
    });
    const nextQuantity = (existing?.quantity || 0) + request.quantity;

    if (variant.stock < nextQuantity) {
      return {
        status: 'out_of_stock',
        message: `Sản phẩm chỉ còn ${variant.stock} trong kho, không đủ để thêm số lượng này.`,
      };
    }

    await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: { cartId: cart.id, variantId: variant.id },
      },
      update: { quantity: nextQuantity },
      create: {
        cartId: cart.id,
        variantId: variant.id,
        quantity: request.quantity,
      },
    });

    return {
      status: 'added',
      message: 'Đã thêm sản phẩm vào giỏ hàng.',
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.product.name,
      productSlug: variant.product.slug,
      size: variant.size,
      color: variant.color,
      quantity: request.quantity,
      cartQuantity: nextQuantity,
      checkoutUrl: '/checkout',
      cartUrl: '/cart',
    };
  }
}
