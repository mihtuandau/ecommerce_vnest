import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserStatus } from '@prisma/client';
import { UpdateUserData, UserFilter } from './user.types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';
import * as bcrypt from 'bcrypt';

import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private uploadService: UploadService,
  ) {}

  async create(data: any): Promise<User> {
    return this.repository.create({
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      name: data.name,
      phone: data.phone,
      role: data.role || 'CUSTOMER',
      status: data.status || UserStatus.ACTIVE,
      verificationCode: data.verificationCode,
      verificationExpires: data.verificationExpires,
      provider: 'LOCAL',
    });
  }

  async createSocial(data: {
    email: string;
    name: string;
    role: string;
    avatar?: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    console.log('=== Creating Social User ===');
    console.log('Social Data:', JSON.stringify(data, null, 2));

    const user = await this.repository.create({
      email: data.email,
      name: data.name,
      role: data.role as any,
      avatar: data.avatar,
      provider: data.provider,
      providerId: data.providerId,
      status: UserStatus.ACTIVE,
    });

    console.log('Social User Created. Avatar:', user.avatar);
    return user;
  }

  async activateUser(id: number): Promise<User> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException('Không tìm thấy người dùng');

    return this.repository.update(id, {
      status: UserStatus.ACTIVE,
      verificationCode: null,
      verificationExpires: null,
    });
  }

  async updateVerification(
    id: number,
    data: {
      verificationCode: string;
      verificationExpires: Date;
      name?: string;
      password?: string;
      phone?: string;
    },
  ): Promise<User> {
    const updateData: UpdateUserData = {
      verificationCode: data.verificationCode,
      verificationExpires: data.verificationExpires,
      status: UserStatus.PENDING,
    };
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.password)
      updateData.password = await bcrypt.hash(data.password, 10);

    return this.repository.update(id, updateData);
  }

  async updateOtpOnly(
    id: number,
    data: { verificationCode: string; verificationExpires: Date },
  ): Promise<User> {
    // Update ONLY OTP and expiry time, do NOT touch password
    return this.repository.update(id, {
      verificationCode: data.verificationCode,
      verificationExpires: data.verificationExpires,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, limit = 10, role, status } = query;
    const skip = (page - 1) * limit;
    const where: UserFilter = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(status ? ({ status } as any) : {}),
    };
    const users = await this.repository.findAll(where, skip, limit);
    return users.map((user) => {
      const {
        password,
        verificationCode,
        verificationExpires,
        resetPasswordToken,
        resetPasswordExpires,
        deletedAt,
        ...safeUser
      } = user;
      return safeUser as any;
    });
  }

  // Chỉ dùng nội bộ để xác thực mật khẩu hiện tại (đổi mật khẩu qua /profile).
  // KHÔNG được trả trực tiếp ra response.
  async findByIdWithPassword(id: number): Promise<User | null> {
    const user = await this.repository.findById(id);
    if (!user || user.deletedAt) return null;
    return user;
  }

  async findOne(id: number): Promise<any | null> {
    const user = await this.repository.findById(id);
    if (!user || user.deletedAt) {
      return null;
    }

    const {
      password,
      verificationCode,
      verificationExpires,
      resetPasswordToken,
      resetPasswordExpires,
      deletedAt,
      ...safeUser
    } = user;

    return safeUser;
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: UpdateUserData = {};

    console.log(`=== Updating User #${id} ===`);
    console.log('Update Data:', JSON.stringify(data, null, 2));

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.phone) updateData.phone = data.phone;
    if (data.avatar) {
      // Dọn dẹp ảnh cũ để tránh rác storage
      const oldUser = await this.repository.findById(id);
      if (oldUser?.avatar && oldUser.avatar !== data.avatar) {
        await this.uploadService.deleteImage(oldUser.avatar).catch(() => {});
      }
      updateData.avatar = data.avatar;
    }
    if ((data as any).provider) updateData.provider = (data as any).provider;
    if ((data as any).providerId)
      updateData.providerId = (data as any).providerId;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.repository.update(id, updateData);
    console.log('Update Success. Avatar in DB:', updated.avatar);
    return updated;
  }

  async remove(id: number): Promise<User> {
    return this.repository.softDeleteUser(id);
  }

  async deactivate(id: number): Promise<User> {
    return this.repository.suspendUser(id);
  }

  async hasOrders(id: number): Promise<boolean> {
    const count = await this.repository.countOrdersByUser(id);
    return count > 0;
  }

  async updateResetToken(
    id: number,
    resetData: UpdateUserResetDto,
  ): Promise<User> {
    const resetPasswordExpires = resetData.resetPasswordExpires
      ? new Date(resetData.resetPasswordExpires)
      : null;

    return this.repository.updateResetToken(
      id,
      resetData.resetPasswordToken || null,
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

  async getPermissionsByRole(role: string): Promise<string[]> {
    return this.repository.getPermissionsByRole(role as any);
  }

  async getAllPermissions() {
    return this.repository.getAllPermissions();
  }

  async getRolesWithPermissions() {
    return this.repository.getRolesWithPermissions();
  }

  async updateRolePermissions(role: string, permissionIds: number[]) {
    return this.repository.updateRolePermissions(role as any, permissionIds);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanupExpiredUsers() {
    await this.repository.softDeleteMany({
      status: UserStatus.PENDING,
      verificationExpiresBefore: new Date(),
      deletedAt: null,
    });
  }
}
