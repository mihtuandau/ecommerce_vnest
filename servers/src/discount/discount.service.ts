import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DiscountRepository } from './discount.repository';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';

@Injectable()
export class DiscountService {
  constructor(private repository: DiscountRepository) {}

  async create(createDiscountDto: CreateDiscountDto) {
    if (!createDiscountDto.percentage && !createDiscountDto.fixedAmount) {
      throw new BadRequestException('Phải có ít nhất percentage hoặc fixedAmount');
    }

    if (createDiscountDto.percentage && createDiscountDto.fixedAmount) {
      throw new BadRequestException('Chỉ được chọn percentage hoặc fixedAmount, không được cả hai');
    }
    const existing = await this.repository.findByCode(createDiscountDto.code);

    if (existing) {
      throw new BadRequestException('Mã giảm giá đã tồn tại');
    }

    // Kiểm tra flash sale trùng lấp
    if (createDiscountDto.isFlashSale) {
      const activeFlash = await this.repository.findActiveFlashSale();
      if (activeFlash) {
        throw new BadRequestException(
          `Đã có flash sale đang chạy: "${activeFlash.code}". Vô hiệu hóa hoặc xóa cái cũ trước rồi mới tạo mới.`,
        );
      }
    }

    // Transform applicableToProducts array to nested create structure for junction table
    const createData: any = {
      code: createDiscountDto.code.toUpperCase(),
      description: createDiscountDto.description,
      image: createDiscountDto.image,
      isFlashSale: createDiscountDto.isFlashSale,
      percentage: createDiscountDto.percentage,
      fixedAmount: createDiscountDto.fixedAmount,
      minOrderAmount: createDiscountDto.minOrderAmount,
      maxDiscountAmount: createDiscountDto.maxDiscountAmount,
      usageLimit: createDiscountDto.usageLimit,
      startDate: new Date(createDiscountDto.startDate),
      endDate: createDiscountDto.endDate ? new Date(createDiscountDto.endDate) : null,
      isActive: createDiscountDto.isActive ?? true,
    };

    // Handle applicableToProducts junction table
    if (createDiscountDto.applicableToProducts && createDiscountDto.applicableToProducts.length > 0) {
      createData.applicableToProducts = {
        create: createDiscountDto.applicableToProducts.map(productId => ({
          productId,
        })),
      };
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

    return discounts.map((discount) => ({
      ...discount,
      status: this.getDiscountStatus(discount.startDate, discount.endDate, discount.isActive),
      usageCount: discount._count.orders,
    }));
  }

  async findOne(id: number) {
    const discount = await this.repository.findById(id);

    if (!discount) {
      throw new NotFoundException('Không tìm thấy mã giảm giá');
    }

    return {
      ...discount,
      status: this.getDiscountStatus(discount.startDate, discount.endDate, discount.isActive),
      usageCount: discount._count.orders,
    };
  }

  async findByCode(code: string) {
    const discount = await this.repository.findByCode(code);

    if (!discount) {
      throw new NotFoundException('Không tìm thấy mã giảm giá');
    }

    return {
      ...discount,
      status: this.getDiscountStatus(discount.startDate, discount.endDate, discount.isActive),
    };
  }

  /** Danh sách khuyến mãi đang hoạt động cho trang public */
  async getPublicDiscounts() {
    const discounts = await this.repository.findPublicActive();
    return discounts.map(d => ({
      ...d,
      usageCount: d._count?.orders || 0,
    }));
  }

  /** Discount (flash hoặc thường) áp dụng cho 1 sản phẩm cụ thể */
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

  /** Map productId → discount tốt nhất (dùng cho card sản phẩm) */
  async getAutoApplyMap() {
    const discounts = await this.repository.findAllAutoApply();
    // Mỗi productId chỉ giữ 1 discount tốt nhất (% cao nhất ưu tiên, flash sale làm tiebreaker)
    const map: Record<number, object> = {};
    for (const d of discounts) {
      // applicableToProducts is now an array of DiscountProduct objects, extract productId
      for (const discountProduct of d.applicableToProducts) {
        const pid = discountProduct.productId;
        if (!map[pid]) {
          map[pid] = {
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

  /** Flash Sale đang diễn ra */
  async getFlashSale() {
    const flashSale = await this.repository.findFlashSale();
    if (!flashSale) return null;

    // Format products giống với ProductService trả về
    const formattedProducts = flashSale.products.map((p: any) => {
      const thumbnail = p.images?.[0]?.url || null;
      const lowestVariant = p.variants?.[0] || null;
      const variantImage = lowestVariant?.images?.[0]?.url || null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        originalPrice: p.basePrice,
        price: lowestVariant?.price || p.basePrice,
        image: variantImage || thumbnail,
        soldCount: p.soldCount,
        averageRating: p.averageRating,
        reviewCount: p.reviewCount,
        viewCount: p.viewCount,
        variants: p.variants,
        category: p.category, // Pass category to frontend
      };
    });

    return {
      id: flashSale.id,
      code: flashSale.code,
      description: flashSale.description,
      image: flashSale.image,
      percentage: flashSale.percentage,
      fixedAmount: flashSale.fixedAmount,
      minOrderAmount: flashSale.minOrderAmount,
      maxDiscountAmount: flashSale.maxDiscountAmount,
      startDate: flashSale.startDate,
      endDate: flashSale.endDate,
      applicableToProducts: flashSale.applicableToProducts,
      products: formattedProducts,
    };
  }

  async validateDiscount(code: string) {
    const discount = await this.repository.findByCode(code);

    if (!discount) {
      return {
        isValid: false,
        message: 'Mã giảm giá không tồn tại',
      };
    }

    // Flash sale được áp dụng tự động — không cho phép nhập mã thủ công
    if (discount.isFlashSale) {
      return {
        isValid: false,
        message: 'Mã này là Flash Sale và đã được áp dụng tự động vào sản phẩm, không cần nhập thêm.',
      };
    }

    if (!discount.isActive) {
      return {
        isValid: false,
        message: 'Mã giảm giá đã bị vô hiệu hóa.',
      };
    }

    const now = new Date();

    if (discount.startDate > now) {
      return {
        isValid: false,
        message: `Mã giảm giá chưa có hiệu lực (từ ${discount.startDate.toLocaleDateString('vi-VN')})`,
      };
    }

    if (discount.endDate && discount.endDate < now) {
      return {
        isValid: false,
        message: 'Mã giảm giá đã hết hạn',
      };
    }

    if (discount.usageLimit) {
      const usageCount = await this.repository.countEffectiveOrdersUsingDiscount(discount.id);
      if (usageCount >= discount.usageLimit) {
        return {
          isValid: false,
          message: 'Mã giảm giá đã đạt giới hạn số lần sử dụng',
        };
      }
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

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const current = await this.findOne(id);

    if (updateDiscountDto.percentage !== undefined || updateDiscountDto.fixedAmount !== undefined) {
      const newPercentage = updateDiscountDto.percentage ?? current.percentage;
      const newFixedAmount = updateDiscountDto.fixedAmount ?? current.fixedAmount;

      if (!newPercentage && !newFixedAmount) {
        throw new BadRequestException('Phải có ít nhất percentage hoặc fixedAmount');
      }

      if (newPercentage && newFixedAmount) {
        throw new BadRequestException('Chỉ được chọn percentage hoặc fixedAmount, không được cả hai');
      }
    }

    const data: any = { ...updateDiscountDto };

    // Kiểm tra flash sale trùng lấp khi bật isFlashSale
    const becomingFlash =
      updateDiscountDto.isFlashSale === true && !current.isFlashSale;
    if (becomingFlash) {
      const activeFlash = await this.repository.findActiveFlashSale(id);
      if (activeFlash) {
        throw new BadRequestException(
          `Đã có flash sale đang chạy: "${activeFlash.code}". Vô hiệu hóa hoặc xóa cái cũ trước rồi mới chỉnh sửa.`,
        );
      }
    }

    if (updateDiscountDto.code) {
      data.code = updateDiscountDto.code.toUpperCase();
    }
    if (updateDiscountDto.startDate) {
      data.startDate = new Date(updateDiscountDto.startDate);
    }
    if (updateDiscountDto.endDate) {
      data.endDate = new Date(updateDiscountDto.endDate);
    }

    if (updateDiscountDto.applicableToProducts !== undefined) {
      const productIds = (updateDiscountDto.applicableToProducts || []).filter(
        (id): id is number => typeof id === 'number' && Number.isFinite(id),
      );
      data.applicableToProducts = productIds.length > 0
        ? {
            deleteMany: {},
            create: productIds.map((productId) => ({ productId })),
          }
        : { deleteMany: {} };
    }

    return this.repository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);
    const usageCount = await this.repository.countOrdersUsingDiscount(id);

    if (usageCount > 0) {
      throw new BadRequestException(
        `Không thể xóa mã giảm giá đang được sử dụng bởi ${usageCount} đơn hàng`,
      );
    }

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
      this.repository.countWithFilter({
        isActive: true,
        endDate: { lt: now },
      }),
      this.repository.countWithFilter({
        isActive: true,
        startDate: { gt: now },
      }),
      this.repository.countWithFilter({
        isActive: false,
      }),
    ]);

    return {
      total,
      active,
      expired,
      upcoming,
      inactive,
    };
  }

  private getDiscountStatus(startDate: Date, endDate: Date | null, isActive?: boolean): string {
    const now = new Date();

    if (isActive === false) {
      return 'inactive';
    }

    if (startDate > now) {
      return 'upcoming';
    }

    if (endDate && endDate < now) {
      return 'expired';
    }

    return 'active';
  }
}
