import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Address, Prisma, UserStatus } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            payment: true,
            orderItems: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        images: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reviews: true,
      },
    });
  }

  async findAll(
    where: Prisma.UserWhereInput,
    skip: number,
    take: number,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        addresses: true,
        orders: true,
        reviews: true,
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async suspendUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.SUSPENDED,
      },
    });
  }

  async softDeleteUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.SUSPENDED,
        deletedAt: new Date(),
      },
    });
  }

  async countOrdersByUser(userId: number): Promise<number> {
    return this.prisma.order.count({ where: { userId } });
  }

  async findAddressesByUser(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
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

  async updateAddress(
    id: number,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address> {
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

  async getPermissionsByRole(role: any): Promise<string[]> {
    const rolePermissions = await this.prisma.permissionRole.findMany({
      where: { role },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => rp.permission.name);
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getRolesWithPermissions() {
    const records = await this.prisma.permissionRole.findMany({
      include: { permission: true },
    });

    // Group by role: { role, permissions[] }
    const grouped: Record<string, { role: string; permissions: any[] }> = {};
    records.forEach((r) => {
      if (!grouped[r.role]) grouped[r.role] = { role: r.role, permissions: [] };
      grouped[r.role].permissions.push(r.permission);
    });

    return Object.values(grouped);
  }

  async updateRolePermissions(role: any, permissionIds: number[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.permissionRole.deleteMany({
        where: { role },
      });

      const newPermissions = permissionIds.map((pId) => ({
        role,
        permissionId: pId,
      }));

      await tx.permissionRole.createMany({
        data: newPermissions,
      });

      return { success: true };
    });
  }
  async deleteMany(where: Prisma.UserWhereInput) {
    return this.prisma.user.deleteMany({ where });
  }

  async softDeleteMany(where: Prisma.UserWhereInput) {
    return this.prisma.user.updateMany({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
