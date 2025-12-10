import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Address, Prisma } from '@prisma/client';

/**
 * Repository pattern for User data access
 * Handles all database queries related to users and addresses
 */
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  /**
   * Find all users with filters
   */
  async findAll(where: Prisma.UserWhereInput, skip: number, take: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      skip,
      take,
      include: { addresses: true },
    });
  }

  /**
   * Update user
   */
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  /**
   * Get all addresses of a user
   */
  async findAddressesByUser(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Find address by ID
   */
  async findAddressById(id: number): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  /**
   * Find default address of a user
   */
  async findDefaultAddress(userId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  /**
   * Create a new address
   */
  async createAddress(data: Prisma.AddressCreateInput): Promise<Address> {
    return this.prisma.address.create({ data });
  }

  /**
   * Update address
   */
  async updateAddress(id: number, data: Prisma.AddressUpdateInput): Promise<Address> {
    return this.prisma.address.update({ where: { id }, data });
  }

  /**
   * Delete address
   */
  async deleteAddress(id: number): Promise<Address> {
    return this.prisma.address.delete({ where: { id } });
  }

  /**
   * Remove default flag from all user's addresses
   */
  async removeDefaultFromAllAddresses(userId: number) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  /**
   * Find next address after deletion (for setting new default)
   */
  async findNextAddress(userId: number, excludeId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: {
        userId,
        id: { not: excludeId },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update user reset token
   */
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
