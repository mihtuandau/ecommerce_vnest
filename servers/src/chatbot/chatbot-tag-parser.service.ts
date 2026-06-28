import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotCartRequest } from './chatbot-cart.service';

@Injectable()
export class ChatbotTagParserService {
  private readonly logger = new Logger(ChatbotTagParserService.name);

  constructor(private prisma: PrismaService) {}

  extractCartRequest(text: string): ChatbotCartRequest | null {
    const tag = text.match(
      /\[\s*(?:cart|add_cart)\s*:\s*variant\s*=\s*(\d+)\s*,?\s*qty\s*=\s*(\d+)\s*\]/i,
    );
    if (!tag) return null;
    return {
      variantId: Number(tag[1]),
      quantity: Math.min(20, Math.max(1, Number(tag[2]) || 1)),
    };
  }

  extractProductIds(text: string): number[] {
    const idTags = text.match(/\[\s*ids?\s*:\s*([\d,\s]+)\s*\]/gi);
    if (!idTags) return [];
    const allIds: number[] = [];
    idTags.forEach((tag) => {
      const numbers = tag.match(/[\d]+/g);
      if (numbers) numbers.forEach((n) => allIds.push(parseInt(n)));
    });
    return Array.from(new Set(allIds)).slice(0, 3);
  }

  extractSuggestions(text: string): string[] {
    const match = text.match(/\[\s*SUGGEST\s*:\s*([^\]]+)\s*\]/i);
    return match ? match[1].split(',').map((s) => s.trim().toLowerCase()) : [];
  }

  async extractDiscounts(text: string): Promise<any[]> {
    try {
      const codes = text.match(/\[\s*code\s*:\s*([^\]]+)\s*\]/gi);
      if (!codes) return [];
      const extractedCodes = codes
        .map((tag) => tag.match(/code\s*:\s*([^\]]+)/i)?.[1].trim())
        .filter(Boolean) as string[];

      return this.prisma.discount.findMany({
        where: {
          code: { in: extractedCodes },
          isActive: true,
          isFlashSale: false,
        },
        select: {
          code: true,
          description: true,
          percentage: true,
          fixedAmount: true,
          isFlashSale: true,
        },
      });
    } catch (error) {
      this.logger.error('Extract Discount Error:', this.getErrorMessage(error));
      return [];
    }
  }

  async getFlashSalePrices(
    productIds: number[],
  ): Promise<Record<number, number>> {
    const flashSalePrice: Record<number, number> = {};
    if (productIds.length === 0) return flashSalePrice;

    const now = new Date();
    const activeDiscounts = await this.prisma.discount.findMany({
      where: {
        isFlashSale: true,
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: { applicableToProducts: true },
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, basePrice: true },
    });

    products.forEach((product) => {
      const discount = activeDiscounts.find((item) =>
        item.applicableToProducts.some((ap) => ap.productId === product.id),
      );
      if (!discount) return;

      const value = discount.percentage
        ? (product.basePrice * discount.percentage) / 100
        : discount.fixedAmount || 0;
      flashSalePrice[product.id] = Math.max(0, product.basePrice - value);
    });

    return flashSalePrice;
  }

  cleanResponse(text: string): string {
    return text
      .replace(/\[\s*(ids?|suggests?|code|cart|add_cart)\s*:[^\]]+\]/gi, '')
      .trim();
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
