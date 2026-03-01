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

    return this.repository.create({
      ...createDiscountDto,
      code: createDiscountDto.code.toUpperCase(),
      startDate: new Date(createDiscountDto.startDate),
      endDate: createDiscountDto.endDate ? new Date(createDiscountDto.endDate) : null,
    });
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
      where.startDate = { lte: now };
      where.OR = [{ endDate: null }, { endDate: { gte: now } }];
    } else if (status === 'expired') {
      where.endDate = { lt: now };
    } else if (status === 'upcoming') {
      where.startDate = { gt: now };
    }

    const discounts = await this.repository.findAll(where);

    return discounts.map((discount) => ({
      ...discount,
      status: this.getDiscountStatus(discount.startDate, discount.endDate),
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
      status: this.getDiscountStatus(discount.startDate, discount.endDate),
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
      status: this.getDiscountStatus(discount.startDate, discount.endDate),
    };
  }

  /** Danh sách khuyến mãi đang hoạt động cho trang public */
  async getPublicDiscounts() {
    return this.repository.findPublicActive();
  }

  async validateDiscount(code: string) {
    const discount = await this.repository.findByCode(code);

    if (!discount) {
      return {
        isValid: false,
        message: 'Mã giảm giá không tồn tại',
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

    return {
      isValid: true,
      message: 'Mã giảm giá hợp lệ',
      discount: {
        id: discount.id,
        code: discount.code,
        description: discount.description,
        discountType: discount.percentage ? 'PERCENTAGE' : 'FIXED',
        discountValue: discount.percentage || discount.fixedAmount,
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
    if (updateDiscountDto.code) {
      data.code = updateDiscountDto.code.toUpperCase();
    }
    if (updateDiscountDto.startDate) {
      data.startDate = new Date(updateDiscountDto.startDate);
    }
    if (updateDiscountDto.endDate) {
      data.endDate = new Date(updateDiscountDto.endDate);
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

    const [total, active, expired, upcoming] = await Promise.all([
      this.repository.count(),
      this.repository.countWithFilter({
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      }),
      this.repository.countWithFilter({
        endDate: { lt: now },
      }),
      this.repository.countWithFilter({
        startDate: { gt: now },
      }),
    ]);

    return {
      total,
      active,
      expired,
      upcoming,
    };
  }

  private getDiscountStatus(startDate: Date, endDate: Date | null): string {
    const now = new Date();

    if (startDate > now) {
      return 'upcoming';
    }

    if (endDate && endDate < now) {
      return 'expired';
    }

    return 'active';
  }
}
