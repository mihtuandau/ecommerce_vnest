import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Discount, Prisma } from '@prisma/client';

@Injectable()
export class DiscountRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DiscountCreateInput): Promise<Discount> {
    return this.prisma.discount.create({ data });
  }

  // Transaction Serializable: đảm bảo chỉ 1 flash sale active tại cùng thời điểm
  // 2 admin tạo cùng lúc → chỉ 1 cái thành công, cái kia bị rollback
  async createFlashSaleTransactional(
    data: Prisma.DiscountCreateInput,
  ): Promise<Discount> {
    return this.prisma.$transaction(
      async (tx) => {
        const now = new Date();
        const activeFlash = await tx.discount.findFirst({
          where: {
            isFlashSale: true,
            isActive: true,
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
          select: { id: true, code: true },
        });

        if (activeFlash) {
          throw new Error(`Đã có flash sale đang chạy: "${activeFlash.code}"`);
        }

        return tx.discount.create({ data });
      },
      { isolationLevel: 'Serializable' },
    );
  }

  async findByCode(code: string): Promise<Discount | null> {
    return this.prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async findById(id: number) {
    return this.prisma.discount.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
        applicableToProducts: true,
      },
    });
  }

  async findAll(where: Prisma.DiscountWhereInput) {
    return this.prisma.discount.findMany({
      where,
      include: {
        _count: {
          select: { orders: true },
        },
        applicableToProducts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: number,
    data: Prisma.DiscountUpdateInput,
  ): Promise<Discount> {
    const normalizedData: any = { ...data };

    if (Array.isArray(normalizedData.applicableToProducts)) {
      const productIds = normalizedData.applicableToProducts.filter(
        (id: unknown) => typeof id === 'number' && Number.isFinite(id),
      );
      normalizedData.applicableToProducts =
        productIds.length > 0
          ? {
              deleteMany: {},
              create: productIds.map((productId: number) => ({ productId })),
            }
          : { deleteMany: {} };
    }

    if (Array.isArray(normalizedData.applicableToCategories)) {
      const categoryIds = normalizedData.applicableToCategories.filter(
        (id: unknown) => typeof id === 'number' && Number.isFinite(id),
      );
      normalizedData.applicableToCategories =
        categoryIds.length > 0
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId: number) => ({ categoryId })),
            }
          : { deleteMany: {} };
    }

    return this.prisma.discount.update({
      where: { id },
      data: normalizedData,
    });
  }

  async delete(id: number): Promise<Discount> {
    return this.prisma.discount.delete({
      where: { id },
    });
  }

  async countOrdersUsingDiscount(discountId: number): Promise<number> {
    return this.prisma.order.count({
      where: { discountId },
    });
  }

  async countEffectiveOrdersUsingDiscount(discountId: number): Promise<number> {
    return this.prisma.order.count({
      where: {
        discountId,
        status: { not: 'CANCELLED' as any },
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.discount.count();
  }

  async findPublicActive() {
    const now = new Date();
    return this.prisma.discount.findMany({
      where: {
        isActive: true,
        isFlashSale: false,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      select: {
        id: true,
        code: true,
        description: true,
        image: true,
        percentage: true,
        fixedAmount: true,
        minOrderAmount: true,
        maxDiscountAmount: true,
        usageLimit: true,
        usageCount: true,
        startDate: true,
        endDate: true,
        isFlashSale: true,
        isActive: true,
        applicableToCategories: true,
        applicableToProducts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countWithFilter(where: Prisma.DiscountWhereInput): Promise<number> {
    return this.prisma.discount.count({ where });
  }

  async findActiveFlashSale(excludeId?: number) {
    const now = new Date();
    return this.prisma.discount.findFirst({
      where: {
        isFlashSale: true,
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true, code: true },
    });
  }

  async findFlashSaleSessions() {
    const now = new Date();
    
    const flashSales = await this.prisma.discount.findMany({
      where: {
        isFlashSale: true,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } }, // Bao gồm cả phiên đã kết thúc trong 24h qua
        ],
      },
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        code: true,
        description: true,
        image: true,
        percentage: true,
        fixedAmount: true,
        startDate: true,
        endDate: true,
        isActive: true,
        isFlashSale: true,
        applicableToCategories: {
          select: { categoryId: true }
        },
        applicableToProducts: {
          select: {
            productId: true,
            stockLimit: true,
            soldCount: true,
            badge: true,
            percentage: true,
            fixedAmount: true,
          },
        },
        _count: {
          select: { orders: true }
        }
      },
    });

    if (flashSales.length === 0) return [];

    const sessionsWithProducts = await Promise.all(flashSales.map(async (fs) => {
      const productWhere: any = { isActive: true };
      
      // If session has specific products, fetch them
      if (fs.applicableToProducts.length > 0) {
        productWhere.id = {
          in: fs.applicableToProducts.map((dp) => dp.productId),
        };
      } else if (fs.applicableToCategories.length > 0) {
        // Fallback to category-based products if no specific products defined
        productWhere.categoryId = {
          in: fs.applicableToCategories.map((dc) => dc.categoryId),
        };
      }

      const products = await this.prisma.product.findMany({
        where: productWhere,
        take: 24, // Increased take for better grid variety
        include: {
          brand: true,
          category: true,
          images: {
            orderBy: { isThumbnail: 'desc' },
            take: 1,
          },
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
          },
        },
      });

      // Map products with their session-specific metadata
      let mappedProducts: any[] = [];
      if (fs.applicableToProducts.length > 0) {
        mappedProducts = fs.applicableToProducts.map(dp => {
          const product = products.find(p => p.id === dp.productId);
          if (!product) return null;
          const totalStock = (product.variants || []).reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
          
          // Use product-specific metadata if it exists, otherwise fallback to session-wide
          const hasSpecificDiscount = dp.percentage !== null || dp.fixedAmount !== null;
          
          return {
            ...dp,
            stockLimit: dp.stockLimit > 0 ? dp.stockLimit : 10,
            percentage: hasSpecificDiscount ? dp.percentage : fs.percentage,
            fixedAmount: hasSpecificDiscount ? dp.fixedAmount : fs.fixedAmount,
            product
          };
        }).filter(Boolean);
      } else {
        // For category-based sessions, they use session-wide percentage/fixedAmount
        mappedProducts = products.map(p => {
          const totalStock = (p.variants || []).reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
          return {
            productId: p.id,
            stockLimit: 10, // Default for category-based auto-flash
            soldCount: 0,
            badge: null,
            percentage: fs.percentage,
            fixedAmount: fs.fixedAmount,
            product: p
          };
        });
      }

      return {
        ...fs,
        products: mappedProducts
      };
    }));

    return sessionsWithProducts;
  }

  async findDiscountForProduct(productId: number) {
    const now = new Date();
    const discounts = await this.prisma.discount.findMany({
      where: {
        isActive: true,
        isFlashSale: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
        applicableToProducts: {
          some: {
            productId,
          },
        },
      },
      select: {
        id: true,
        code: true,
        percentage: true,
        fixedAmount: true,
        startDate: true,
        endDate: true,
        description: true,
        isFlashSale: true,
        isActive: true,
      },
      orderBy: [{ percentage: 'desc' }, { fixedAmount: 'desc' }],
    });

    return discounts[0] ?? null;
  }

  async findAllAutoApply() {
    const now = new Date();
    return this.prisma.discount.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        AND: [
          {
            OR: [
              { isFlashSale: true },
              { code: "" }
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ],
          }
        ]
      },
      select: {
        id: true,
        code: true,
        percentage: true,
        fixedAmount: true,
        endDate: true,
        isFlashSale: true,
        isActive: true,
        startDate: true,
        applicableToProducts: true,
      },
      orderBy: [{ percentage: 'desc' }, { fixedAmount: 'desc' }],
    });
  }

  async hasUserUsedDiscount(
    userId: number,
    discountId: number,
  ): Promise<boolean> {
    const count = await this.prisma.discountUsage.count({
      where: {
        userId,
        discountId,
      },
    });
    return count > 0;
  }
}
