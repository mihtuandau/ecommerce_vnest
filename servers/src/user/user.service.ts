
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma, User, UserStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: any): Promise<User> {
    return this.repository.create({
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      name: data.name,
      role: data.role || 'CUSTOMER',
      status: data.status || UserStatus.ACTIVE,
      verificationCode: data.verificationCode,
      verificationExpires: data.verificationExpires,
    });
  }

  async activateUser(id: number): Promise<User> {

    const updatedUser = await this.repository.update(id, {
      status: UserStatus.ACTIVE,
      verificationCode: null,
      verificationExpires: null,
      deletedAt: null, 
    });

    return updatedUser;
  }

  async updateVerification(id: number, data: { verificationCode: string; verificationExpires: Date; name?: string; password?: string }): Promise<User> {
    return this.repository.update(id, {
      verificationCode: data.verificationCode,
      verificationExpires: data.verificationExpires,
      name: data.name,
      password: data.password,
      status: UserStatus.PENDING, 
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, limit = 10, role, status } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(status ? ({ status } as any) : {}),
    };
    const users = await this.repository.findAll(where, skip, limit);
    return users.map(user => {
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
    const updateData: Prisma.UserUpdateInput = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return this.repository.update(id, updateData);
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

  async updateResetToken(id: number, resetData: UpdateUserResetDto): Promise<User> {
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

    const deleteResult = await this.repository.deleteMany({
      status: UserStatus.PENDING,
      verificationExpires: {
        lt: new Date(),
      },
    });

    if (deleteResult.count > 0) {

    } else {

    }
  }
}





