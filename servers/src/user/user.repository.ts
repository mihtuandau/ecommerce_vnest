import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import {
  UserEntity,
  CreateUserData,
  UpdateUserData,
  UserFilter,
} from './user.types';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async findById(id: number): Promise<UserEntity | null> {
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
    filter: UserFilter,
    skip: number,
    take: number,
  ): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: this.toWhere(filter),
      skip,
      take,
      include: {
        addresses: true,
        orders: true,
        reviews: true,
      },
    });
  }

  async update(id: number, data: UpdateUserData): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async suspendUser(id: number): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.SUSPENDED,
      },
    });
  }

  async softDeleteUser(id: number): Promise<UserEntity> {
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

  async updateResetToken(
    id: number,
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
  ): Promise<UserEntity> {
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

  async softDeleteMany(filter: UserFilter) {
    return this.prisma.user.updateMany({
      where: this.toWhere(filter),
      data: { deletedAt: new Date() },
    });
  }

  private toWhere(filter: UserFilter) {
    const { verificationExpiresBefore, ...rest } = filter;
    return {
      ...rest,
      ...(verificationExpiresBefore
        ? { verificationExpires: { lt: verificationExpiresBefore } }
        : {}),
    };
  }
}
