import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Brand } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Brand> {
    return this.prisma.brand.create({ data });
  }

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Brand | null> {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { deletedAt: null },
          take: 10,
        },
      },
    });
  }

  async update(id: number, data: any): Promise<Brand> {
    return this.prisma.brand.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Brand> {
    return this.prisma.brand.delete({ where: { id } });
  }
}
