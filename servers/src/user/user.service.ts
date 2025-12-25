// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
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
}