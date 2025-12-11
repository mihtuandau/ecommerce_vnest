import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address, Prisma } from '@prisma/client';

/**
 * Repository pattern for Address data access
 * Handles all database queries related to addresses
 */
@Injectable()
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all addresses by user ID
   */
  async findByUserId(userId: number): Promise<Address[]> {
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
  async findById(id: number): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  /**
   * Find default address by user ID
   */
  async findDefaultByUserId(userId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  /**
   * Create a new address
   */
  async create(data: Prisma.AddressCreateInput): Promise<Address> {
    return this.prisma.address.create({ data });
  }

  /**
   * Update address
   */
  async update(id: number, data: Prisma.AddressUpdateInput): Promise<Address> {
    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete address
   */
  async delete(id: number): Promise<Address> {
    return this.prisma.address.delete({
      where: { id },
    });
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
   * Find next address for setting as default
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
   * Count addresses by user
   */
  async countByUserId(userId: number): Promise<number> {
    return this.prisma.address.count({
      where: { userId },
    });
  }
}
