import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address, Prisma } from '@prisma/client';

@Injectable()
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: number): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findDefaultByUserId(userId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async create(data: Prisma.AddressCreateInput): Promise<Address> {
    return this.prisma.address.create({ data });
  }

  async update(id: number, data: Prisma.AddressUpdateInput): Promise<Address> {
    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Address> {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async removeDefaultFromAllAddresses(userId: number) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async findNextAddress(
    userId: number,
    excludeId: number,
  ): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: {
        userId,
        id: { not: excludeId },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return this.prisma.address.count({
      where: { userId },
    });
  }
}
