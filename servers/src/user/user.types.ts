import { User, Role, UserStatus } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type UserEntity = User;

export interface CreateUserData {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  role?: Role;
  status?: UserStatus;
  verificationCode?: string | null;
  verificationExpires?: Date | null;
  provider?: string;
  providerId?: string;
  avatar?: string;
}

export type UpdateUserData = Partial<
  Omit<CreateUserData, 'email'> & {
    email: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
  }
>;

export interface UserFilter {
  deletedAt?: Date | null;
  role?: Role;
  status?: UserStatus;
  verificationExpiresBefore?: Date;
}
