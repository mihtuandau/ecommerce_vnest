// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, limit = 10, role } = query;
    const skip = (page - 1) * limit;
    return this.prisma.user.findMany({
      where: { role },
      skip,
      take: limit,
      include: { addresses: true },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  // ✨ THÊM: Get all addresses của user
  async getAddresses(userId: number): Promise<any[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  // ✨ THÊM: Get một address cụ thể
  async getAddress(id: number): Promise<any> {
    return this.prisma.address.findUnique({
      where: { id }
    });
  }

  async addAddress(userId: number, data: CreateAddressDto): Promise<any> {
    // Kiểm tra xem user đã có địa chỉ default chưa
    const hasDefault = await this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });

    // Nếu chưa có địa chỉ nào, đặt làm default
    // Nếu đã có địa chỉ và user muốn đặt làm default, bỏ default của địa chỉ cũ
    const isDefault = !hasDefault ? true : (data.isDefault || false);

    // Nếu địa chỉ mới là default, bỏ default của tất cả địa chỉ khác
    if (isDefault && hasDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: { 
        userId, 
        ...data, 
        isDefault 
      },
    });
  }

  async updateAddress(id: number, data: UpdateAddressDto): Promise<any> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId: address.userId,
          id: { not: id },
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.update({ where: { id }, data });
  }

  // ✨ THÊM: Delete address
  async deleteAddress(id: number): Promise<any> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new Error('Address not found');

    // Nếu xóa address default, set address khác làm default
    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({
        where: {
          userId: address.userId,
          id: { not: id }
        },
        orderBy: { createdAt: 'asc' }
      });

      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return this.prisma.address.delete({ where: { id } });
  }

  // ✨ THÊM: Set default address
  async setDefaultAddress(id: number, userId: number): Promise<any> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new Error('Address not found');
    if (address.userId !== userId) throw new Error('Address does not belong to user');

    // Remove default from all user's addresses
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    // Set this address as default
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });
  }

  async updateResetToken(id: number, resetData: UpdateUserResetDto): Promise<User> {const updateData: Prisma.UserUpdateInput = {
      resetPasswordToken: resetData.resetPasswordToken,
      resetPasswordExpires: resetData.resetPasswordExpires ? new Date(resetData.resetPasswordExpires) : null,
    };const result = await this.prisma.user.update({
      where: { id },
      data: updateData
    });return result;
  }

  async resetPassword(id: number, password: string): Promise<User> {const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    });return result;
  }
}