import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Discount, Prisma } from '@prisma/client';


@Injectable()
export class DiscountRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.DiscountCreateInput): Promise<Discount> {
    return this.prisma.discount.create({ data });
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

    // Defensive normalization: nếu caller truyền mảng thô thì convert về nested update input.
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
        endDate: true,
        applicableToCategories: true,
        applicableToProducts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countWithFilter(where: Prisma.DiscountWhereInput): Promise<number> {
    return this.prisma.discount.count({ where });
  }

  /** Kiểm tra xem đã có flash sale nào đang active chưa (dùng để validate) */
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

    // Ưu tiên 1: sản phẩm được gán trực tiếp
    // Ưu tiên 2: sản phẩm theo category
    // Ưu tiên 3: bán chạy nhất toàn site
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
      // Giữ thứ tự như admin đã chọn nếu có specificProducts, ngược lại sắp bán chạy
      orderBy: flashSale.applicableToProducts.length > 0
        ? { id: 'asc' }
        : { soldCount: 'desc' },
      include: {
        images: {
          orderBy: { isThumbnail: 'desc' },  // thumbnail trước, nếu không có thì lấy ảnh đầu tiên
          take: 1,
        },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 3,
          include: {
            images: {
              orderBy: { isPrimary: 'desc' }, // primary trước, nếu không có thì lấy ảnh đầu tiên
              take: 1,
            },
          },
        },
      },
    });

    // Nếu có specificProducts thì sắp lại theo thứ tự admin đã chọn
    const orderedProducts = flashSale.applicableToProducts.length > 0
      ? flashSale.applicableToProducts
          .map((dp) => products.find((p) => p.id === dp.productId))
          .filter(Boolean)
      : products;

    return { ...flashSale, products: orderedProducts };
  }

  /** Tìm discount tốt nhất đang active áp dụng cho 1 sản phẩm cụ thể (flash hoặc thường) */
  async findDiscountForProduct(productId: number) {
    const now = new Date();
    // Lấy TẤT CẢ discount active, lọc theo product trong WHERE
    const discounts = await this.prisma.discount.findMany({
      where: {
        isActive: true,
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
        { percentage: 'desc' },   // % giảm cao nhất ưu tiên trước
        { fixedAmount: 'desc' },  // rồi đến giảm tiền cố định cao nhất
        { isFlashSale: 'desc' },  // flash sale làm tiebreaker nếu ngang nhau
      ],
    });

    return discounts[0] ?? null;
  }

  /** Tất cả discount active có danh sách sản phẩm cụ thể (dùng cho bulk map) */
  async findAllAutoApply() {
    const now = new Date();
    return this.prisma.discount.findMany({
      where: {
        isActive: true,
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
        { percentage: 'desc' },   // % giảm cao nhất ưu tiên trước
        { fixedAmount: 'desc' },  // rồi đến giảm tiền cố định cao nhất
        { isFlashSale: 'desc' },  // flash sale làm tiebreaker nếu ngang nhau
      ],
    });
  }
}
