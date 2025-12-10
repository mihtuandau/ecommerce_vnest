// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
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
  constructor(private repository: UserRepository) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.repository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, limit = 10, role } = query;
    const skip = (page - 1) * limit;
    const where = role ? { role } : {};
    return this.repository.findAll(where, skip, limit);
  }

  async findOne(id: number): Promise<User | null> {
    return this.repository.findById(id);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    return this.repository.update(id, updateData);
  }

  async remove(id: number): Promise<User> {
    return this.repository.delete(id);
  }

  // ✨ THÊM: Get all addresses của user
  async getAddresses(userId: number): Promise<any[]> {
    return this.repository.findAddressesByUser(userId);
  }

  // ✨ THÊM: Get một address cụ thể
  async getAddress(id: number): Promise<any> {
    return this.repository.findAddressById(id);
  }

  async addAddress(userId: number, data: CreateAddressDto): Promise<any> {
    // Kiểm tra xem user đã có địa chỉ default chưa
    const hasDefault = await this.repository.findDefaultAddress(userId);

    // Nếu chưa có địa chỉ nào, đặt làm default
    // Nếu đã có địa chỉ và user muốn đặt làm default, bỏ default của địa chỉ cũ
    const isDefault = !hasDefault ? true : (data.isDefault || false);

    // Nếu địa chỉ mới là default, bỏ default của tất cả địa chỉ khác
    if (isDefault && hasDefault) {
      await this.repository.removeDefaultFromAllAddresses(userId);
    }

    return this.repository.createAddress({
      user: { connect: { id: userId } },
      ...data,
      isDefault,
    });
  }

  async updateAddress(id: number, data: UpdateAddressDto): Promise<any> {
    const address = await this.repository.findAddressById(id);
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await this.repository.removeDefaultFromAllAddresses(address.userId);
    }
    return this.repository.updateAddress(id, data);
  }

  // ✨ THÊM: Delete address
  async deleteAddress(id: number): Promise<any> {
    const address = await this.repository.findAddressById(id);
    if (!address) throw new Error('Address not found');

    // Nếu xóa address default, set address khác làm default
    if (address.isDefault) {
      const nextAddress = await this.repository.findNextAddress(address.userId, id);

      if (nextAddress) {
        await this.repository.updateAddress(nextAddress.id, { isDefault: true });
      }
    }

    return this.repository.deleteAddress(id);
  }

  // ✨ THÊM: Set default address
  async setDefaultAddress(id: number, userId: number): Promise<any> {
    const address = await this.repository.findAddressById(id);
    if (!address) throw new Error('Address not found');
    if (address.userId !== userId) throw new Error('Address does not belong to user');

    // Remove default from all user's addresses
    await this.repository.removeDefaultFromAllAddresses(userId);

    // Set this address as default
    return this.repository.updateAddress(id, { isDefault: true });
  }

  async updateResetToken(id: number, resetData: UpdateUserResetDto): Promise<User> {
    const resetPasswordExpires = resetData.resetPasswordExpires 
      ? new Date(resetData.resetPasswordExpires) 
      : null;
    
    return this.repository.updateResetToken(
      id,
      resetData.resetPasswordToken,
      resetPasswordExpires,
    );
  }

  async resetPassword(id: number, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.repository.update(id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
}