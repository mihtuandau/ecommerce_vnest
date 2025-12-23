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
    return this.prisma.discount.update({
      where: { id },
      data,
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

  async count(): Promise<number> {
    return this.prisma.discount.count();
  }

  async countWithFilter(where: Prisma.DiscountWhereInput): Promise<number> {
    return this.prisma.discount.count({ where });
  }
}
