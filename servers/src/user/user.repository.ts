import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Address, Prisma } from '@prisma/client';


@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  async findAll(where: Prisma.UserWhereInput, skip: number, take: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      skip,
      take,
      include: { addresses: true },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async countOrdersByUser(userId: number): Promise<number> {
    return this.prisma.order.count({ where: { userId } });
  }

  async suspendUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'SUSPENDED' as any,
      } as any,
    });
  }

  async softDeleteUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'SUSPENDED' as any,
        deletedAt: new Date(),
      } as any,
    });
  }

  async findAddressesByUser(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findAddressById(id: number): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findDefaultAddress(userId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async createAddress(data: Prisma.AddressCreateInput): Promise<Address> {
    return this.prisma.address.create({ data });
  }

  async updateAddress(id: number, data: Prisma.AddressUpdateInput): Promise<Address> {
    return this.prisma.address.update({ where: { id }, data });
  }

  async deleteAddress(id: number): Promise<Address> {
    return this.prisma.address.delete({ where: { id } });
  }

  async removeDefaultFromAllAddresses(userId: number) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async findNextAddress(userId: number, excludeId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: {
        userId,
        id: { not: excludeId },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
  async updateResetToken(
    id: number,
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        resetPasswordToken,
        resetPasswordExpires,
      },
    });
  }
}
