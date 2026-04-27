import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DiscountRepository } from './discount.repository';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';

@Injectable()
export class DiscountService {
  constructor(private repository: DiscountRepository) {}

  private mapDiscount(discount: any) {
    if (!discount) return null;
    return {
      ...discount,
      status: this.getDiscountStatus(
        discount.startDate,
        discount.endDate,
        discount.isActive,
      ),
      usageCount: discount._count?.orders || 0,
    };
  }

  private validateType(dto: { percentage?: number; fixedAmount?: number }) {
    if (!dto.percentage && !dto.fixedAmount) {
      throw new BadRequestException(
        'Phải có ít nhất percentage hoặc fixedAmount',
      );
    }
    if (dto.percentage && dto.fixedAmount) {
      throw new BadRequestException(
        'Chỉ được chọn percentage hoặc fixedAmount, không được cả hai',
      );
    }
  }

  async create(dto: CreateDiscountDto) {
    this.validateType(dto);
    const existing = await this.repository.findByCode(dto.code);
    if (existing) throw new BadRequestException('Mã giảm giá đã tồn tại');

    const { applicableToProducts, ...rest } = dto;
    const createData: any = {
      ...rest,
      code: dto.code.toUpperCase(),
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      isActive: dto.isActive ?? true,
    };

    if (applicableToProducts?.length) {
      createData.applicableToProducts = {
        create: applicableToProducts.map((productId) => ({ productId })),
      };
    } else {
      delete createData.applicableToProducts;
    }

    // Flash Sale: dùng Serializable transaction để ngăn race condition
    // 2 admin tạo cùng lúc → chỉ 1 cái thành công
    if (dto.isFlashSale) {
      return this.repository.createFlashSaleTransactional(createData);
    }

    return this.repository.create(createData);
  }

  async findAll(query: QueryDiscountDto) {
    const { search, status } = query;
    const now = new Date();
    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.isFlashSale !== undefined) {
      where.isFlashSale = query.isFlashSale;
    }

    if (status === 'active') {
      where.isActive = true;
      where.startDate = { lte: now };
      where.OR = [{ endDate: null }, { endDate: { gte: now } }];
    } else if (status === 'expired') {
      where.isActive = true;
      where.endDate = { lt: now };
    } else if (status === 'upcoming') {
      where.isActive = true;
      where.startDate = { gt: now };
    }

    const discounts = await this.repository.findAll(where);
    return discounts.map((d) => this.mapDiscount(d));
  }

  async findOne(id: number) {
    const discount = await this.repository.findById(id);
    if (!discount) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return this.mapDiscount(discount);
  }

  async findByCode(code: string) {
    const discount = await this.repository.findByCode(code);
    if (!discount) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return this.mapDiscount(discount);
  }

  async getPublicDiscounts() {
    const discounts = await this.repository.findPublicActive();
    return discounts.map((d) => this.mapDiscount(d));
  }

  async getProductDiscount(productId: number) {
    const discount = await this.repository.findDiscountForProduct(productId);
    if (!discount) return null;
    return {
      id: discount.id,
      code: discount.code,
      percentage: discount.percentage,
      fixedAmount: discount.fixedAmount,
      endDate: discount.endDate,
      description: discount.description,
      isFlashSale: discount.isFlashSale,
    };
  }

  async getAutoApplyMap() {
    const discounts = await this.repository.findAllAutoApply();
    const now = new Date();
    const map: Record<number, any> = {};
    for (const d of discounts) {
      // Only include active discounts that haven't expired
      if (!d.isActive) continue;
      if (d.startDate > now) continue; // Discount not started yet
      if (d.endDate && d.endDate < now) continue; // Discount expired

      for (const dp of d.applicableToProducts) {
        if (!map[dp.productId]) {
          map[dp.productId] = {
            percentage: d.percentage,
            fixedAmount: d.fixedAmount,
            isFlashSale: d.isFlashSale,
            endDate: d.endDate,
          };
        }
      }
    }
    return map;
  }

  async getFlashSale() {
    const flashSale = await this.repository.findFlashSale();
    if (!flashSale) return null;

    const formattedProducts = flashSale.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      originalPrice: p.basePrice,
      price: p.variants?.[0]?.price || p.basePrice,
      image: p.variants?.[0]?.images?.[0]?.url || p.images?.[0]?.url || null,
      soldCount: p.soldCount,
      averageRating: p.averageRating,
      reviewCount: p.reviewCount,
      viewCount: p.viewCount,
      variants: p.variants,
      category: p.category,
    }));

    return { ...flashSale, products: formattedProducts };
  }

  async validateDiscount(code: string, userId?: number) {
    const discount = await this.repository.findByCode(code);
    if (!discount)
      return { isValid: false, message: 'Mã giảm giá không tồn tại' };
    if (discount.isFlashSale)
      return {
        isValid: false,
        message: 'Mã này là Flash Sale đã được áp dụng tự động.',
      };
    if (!discount.isActive)
      return { isValid: false, message: 'Mã giảm giá đã bị vô hiệu hóa.' };

    const now = new Date();
    if (discount.startDate > now)
      return {
        isValid: false,
        message: `Chưa có hiệu lực (từ ${discount.startDate.toLocaleDateString('vi-VN')})`,
      };
    if (discount.endDate && discount.endDate < now)
      return { isValid: false, message: 'Mã giảm giá đã hết hạn' };

    // Kiểm tra giới hạn sử dụng của người dùng (mỗi người dùng 1 lần)
    console.log(`[DiscountService] Validating code: ${code} for userId: ${userId}`);
    if (userId) {
      const hasUsed = await this.repository.hasUserUsedDiscount(userId, discount.id);
      console.log(`[DiscountService] User ${userId} has used discount ${discount.id}: ${hasUsed}`);
      if (hasUsed) {
        return { isValid: false, message: 'Bạn đã sử dụng mã giảm giá này cho đơn hàng trước đó' };
      }
    }

    if (discount.usageLimit) {
      const usageCount =
        await this.repository.countEffectiveOrdersUsingDiscount(discount.id);
      if (usageCount >= discount.usageLimit)
        return { isValid: false, message: 'Đã đạt giới hạn số lần sử dụng' };
    }

    return {
      isValid: true,
      message: 'Mã giảm giá hợp lệ',
      discount: {
        id: discount.id,
        code: discount.code,
        description: discount.description,
        discountType: discount.percentage ? 'PERCENTAGE' : 'FIXED',
        discountValue: discount.percentage || discount.fixedAmount,
        minOrderAmount: discount.minOrderAmount,
        maxDiscountAmount: discount.maxDiscountAmount,
      },
    };
  }

  async update(id: number, dto: UpdateDiscountDto) {
    const current = await this.findOne(id);

    // Check if flash sale has already started - prevent modification of critical fields
    if (current.isFlashSale && current.startDate <= new Date()) {
      const restrictedFields = [
        'startDate',
        'endDate',
        'percentage',
        'fixedAmount',
        'code',
        'applicableToProducts',
      ];
      const attemptedChanges = restrictedFields.filter(
        (field) => dto[field] !== undefined && dto[field] !== current[field],
      );

      if (attemptedChanges.length > 0) {
        throw new BadRequestException(
          `Không thể chỉnh sửa flash sale đã bắt đầu. Các trường không thể thay đổi: ${attemptedChanges.join(', ')}`,
        );
      }
    }

    if (dto.percentage !== undefined || dto.fixedAmount !== undefined) {
      this.validateType({
        percentage: dto.percentage ?? current.percentage,
        fixedAmount: dto.fixedAmount ?? current.fixedAmount,
      });
    }

    if (dto.isFlashSale === true && !current.isFlashSale) {
      const activeFlash = await this.repository.findActiveFlashSale(id);
      if (activeFlash)
        throw new BadRequestException(
          `Đã có flash sale đang chạy: "${activeFlash.code}"`,
        );
    }

    const { applicableToProducts, ...rest } = dto;
    const data: any = { ...rest };
    if (dto.code) data.code = dto.code.toUpperCase();
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    if (applicableToProducts !== undefined) {
      const productIds = (applicableToProducts || []).filter(
        (pid) => typeof pid === 'number',
      );
      data.applicableToProducts = {
        deleteMany: {},
        create: productIds.map((productId) => ({ productId })),
      };
    } else {
      delete data.applicableToProducts;
    }

    return this.repository.update(id, data);
  }

  async remove(id: number) {
    const usageCount = await this.repository.countOrdersUsingDiscount(id);
    if (usageCount > 0)
      throw new BadRequestException(
        `Không thể xóa vì đang được sử dụng bởi ${usageCount} đơn hàng`,
      );
    return this.repository.delete(id);
  }

  async getStats() {
    const now = new Date();
    const [total, active, expired, upcoming, inactive] = await Promise.all([
      this.repository.count(),
      this.repository.countWithFilter({
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      }),
      this.repository.countWithFilter({ isActive: true, endDate: { lt: now } }),
      this.repository.countWithFilter({
        isActive: true,
        startDate: { gt: now },
      }),
      this.repository.countWithFilter({ isActive: false }),
    ]);

    return { total, active, expired, upcoming, inactive };
  }

  private getDiscountStatus(
    startDate: Date,
    endDate: Date | null,
    isActive?: boolean,
  ): string {
    const now = new Date();
    if (isActive === false) return 'inactive';
    if (startDate > now) return 'upcoming';
    if (endDate && endDate < now) return 'expired';
    return 'active';
  }
}
