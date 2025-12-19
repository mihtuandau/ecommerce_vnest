// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
      role: 'CUSTOMER',
    });

    const { password: _, ...result } = user;
    const tokenPayload = { sub: result.id };
    return this.login(tokenPayload, result);
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { email, password, name } = registerAdminDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    });

    const { password: _, ...result } = user;
    const tokenPayload = { sub: result.id };
    return this.login(tokenPayload, result);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(tokenPayload: any, userInfo?: any) {
    const user = userInfo || (await this.userService.findOne(tokenPayload.sub));

    const payload = {
      sub: tokenPayload.sub,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d', // 7 days
    });

    const { password: _, ...safeUser } = user;

    return {
      access_token: accessToken,
      user: safeUser,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const resetData: UpdateUserResetDto = {
      resetPasswordToken: await bcrypt.hash(token, 10),
      resetPasswordExpires: expires.toISOString(),
    };

    await this.userService.updateResetToken(user.id, resetData);

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Use MailService with beautiful template
    await this.mailService.sendPasswordReset(
      email,
      resetUrl,
      user.name || 'User',
    );

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(
    token: string,
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);

    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    // 🔒 FIX: Compare hashed token
    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValidToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.userService.resetPassword(user.id, password);

    return { message: 'Password reset successfully' };
  }

  setAuthCookie(res: any, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearAuthCookie(res: any) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
  }

  async getUserInfo(userId: number) {
    return this.userService.findOne(userId);
  }
}
