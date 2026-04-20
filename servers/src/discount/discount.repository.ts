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
  async createFlashSaleTransactional(data: Prisma.DiscountCreateInput): Promise<Discount> {
    return this.prisma.$transaction(async (tx) => {
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
    }, { isolationLevel: 'Serializable' });
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: Prisma.DiscountUpdateInput): Promise<Discount> {
    const normalizedData: any = { ...data };

    if (Array.isArray(normalizedData.applicableToProducts)) {
      const productIds = normalizedData.applicableToProducts.filter(
        (id: unknown) => typeof id === 'number' && Number.isFinite(id),
      );
      normalizedData.applicableToProducts = productIds.length > 0
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
      normalizedData.applicableToCategories = categoryIds.length > 0
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
        _count: {
          select: { orders: true }
        },
        endDate: true,
        isFlashSale: true,
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

  async findFlashSale() {
    const now = new Date();
    const flashSale = await this.prisma.discount.findFirst({
      where: {
        isFlashSale: true,
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      orderBy: { endDate: 'asc' },
      select: {
        id: true,
        code: true,
        description: true,
        image: true,
        percentage: true,
        fixedAmount: true,
        minOrderAmount: true,
        maxDiscountAmount: true,
        startDate: true,
        endDate: true,
        applicableToCategories: true,
        applicableToProducts: true,
      },
    });

    if (!flashSale) return null;

    if (flashSale.applicableToProducts.length === 0 && flashSale.applicableToCategories.length === 0) {
      return { ...flashSale, products: [] };
    }

    const productWhere: any = { isActive: true };
    if (flashSale.applicableToProducts.length > 0) {
      productWhere.id = {
        in: flashSale.applicableToProducts.map((dp) => dp.productId),
      };
    } else if (flashSale.applicableToCategories.length > 0) {
      productWhere.categoryId = {
        in: flashSale.applicableToCategories.map((dc) => dc.categoryId),
      };
    }

    const products = await this.prisma.product.findMany({
      where: productWhere,
      take: 8,
      orderBy: flashSale.applicableToProducts.length > 0
        ? { id: 'asc' }
        : { soldCount: 'desc' },
        include: {
          category: true,
          images: {
            orderBy: { isThumbnail: 'desc' },
            take: 1,
          },
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 3,
            include: {
              images: {
                orderBy: { isPrimary: 'desc' },
                take: 1,
              },
            },
          },
        },
    });

    const orderedProducts = flashSale.applicableToProducts.length > 0
      ? flashSale.applicableToProducts
          .map((dp) => products.find((p) => p.id === dp.productId))
          .filter(Boolean)
      : products;

    return { ...flashSale, products: orderedProducts };
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
        endDate: true,
        description: true,
        isFlashSale: true,
      },
      orderBy: [
        { percentage: 'desc' },
        { fixedAmount: 'desc' },
      ],
    });

    return discounts[0] ?? null;
  }

  async findAllAutoApply() {
    const now = new Date();
    return this.prisma.discount.findMany({
      where: {
        isActive: true,
        isFlashSale: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      select: {
        id: true,
        code: true,
        percentage: true,
        fixedAmount: true,
        endDate: true,
        isFlashSale: true,
        applicableToProducts: true,
      },
      orderBy: [
        { percentage: 'desc' },
        { fixedAmount: 'desc' },
      ],
    });
  }
}
