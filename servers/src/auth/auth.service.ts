import { UserStatus } from '@prisma/client';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async register(dto: any) {
    const { email, password, name, phone } = dto;
    const existing = await this.userService.findByEmail(email);
    
    // Allow re-registration for PENDING users to refresh OTP/info
    // Block if email is ACTIVE (and not deleted)
    if (existing?.status === UserStatus.ACTIVE && !existing.deletedAt) {
      throw new BadRequestException('Email đã tồn tại.');
    }
    
    // Block only if email is SUSPENDED
    if (existing?.status === UserStatus.SUSPENDED) {
      throw new BadRequestException('Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const verificationHash = await bcrypt.hash(otp, 10);
    const hashData = { 
      verificationCode: verificationHash, 
      verificationExpires: expires, 
      name, 
      phone,
      password // raw password
    };
    
    // If user exists (PENDING or DELETED), update account info and send new OTP
    if (existing) {
      await this.userService.updateVerification(existing.id, hashData);
      await this.mailService.sendVerificationCode(email, otp, name);
      return { message: 'Bạn chưa xác thực tài khoản. Chúng tôi đã gửi lại mã OTP.', email };
    } else {
      // Create new user
      await this.userService.create({ ...dto, email, role: 'CUSTOMER', status: UserStatus.PENDING, ...hashData });
      await this.mailService.sendVerificationCode(email, otp, name);
      return { message: 'Mã xác thực đã gửi.', email };
    }
  }

  async verifyOtp(email: string, code: string) {
    const u = await this.userService.findByEmail(email);
    if (!u || u.status === UserStatus.ACTIVE || !u.verificationCode || !u.verificationExpires || new Date() > new Date(u.verificationExpires)) {
      throw new BadRequestException('Mã không hợp lệ hoặc đã hết hạn.');
    }

    const isMatch = await bcrypt.compare(code, u.verificationCode);
    if (!isMatch) {
      throw new BadRequestException('Mã xác thực không chính xác.');
    }

    const activatedUser = await this.userService.activateUser(u.id);
    const loginData = await this.login({ sub: activatedUser.id }, activatedUser);

    return { 
      message: 'Kích hoạt thành công.',
      ...loginData
    };
  }

  async resendOtp(email: string) {
    const u = await this.userService.findByEmail(email);
    if (!u) throw new BadRequestException('User not found');
    // Only allow resend for PENDING users
    if (u.status !== UserStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể gửi lại mã cho tài khoản chưa xác thực');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userService.updateOtpOnly(u.id, { 
      verificationCode: await bcrypt.hash(otp, 10), 
      verificationExpires: new Date(Date.now() + 600000) 
    });
    await this.mailService.sendVerificationCode(email, otp, u.name || undefined);
    return { message: 'Mã mới đã gửi.' };
  }

  async validateUser(email: string, pass: string) {
    const u = await this.userService.findByEmail(email);
    if (!u || !(await bcrypt.compare(pass, u.password)) || u.deletedAt) throw new UnauthorizedException('Thông tin không đúng.');
    if (u.status === UserStatus.PENDING) throw new UnauthorizedException('Chưa xác thực.');
    const { password: _, ...res } = u; return res;
  }

  async login(payload: any, info?: any) {
    const u = info || await this.userService.findOne(payload.sub);
    const common = { sub: u.id, email: u.email, role: u.role };
    const refreshToken = this.jwtService.sign({ sub: u.id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

    // Lưu hash của refresh token vào DB để có thể revoke
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: u.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      },
    });

    // Dọn token cũ đã hết hạn của user (giữ tối đa 5 thiết bị)
    await this.cleanupOldTokens(u.id);

    const { password, verificationCode, verificationExpires, resetPasswordToken, resetPasswordExpires, ...safeUser } = u;

    return {
      accessToken: this.jwtService.sign(common, { secret: process.env.JWT_SECRET, expiresIn: '2h' }),
      refreshToken,
      user: { ...safeUser, permissions: await this.userService.getPermissionsByRole(u.role) }
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const p = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

      // Kiểm tra token có trong DB và chưa bị revoke
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Token đã hết hạn hoặc bị thu hồi');
      }

      const u = await this.userService.findOne(p.sub);
      if (!u) throw new UnauthorizedException();

      return { accessToken: this.jwtService.sign({ sub: u.id, email: u.email, role: u.role }, { secret: process.env.JWT_SECRET, expiresIn: '2h' }) };
    } catch { throw new UnauthorizedException(); }
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      // Revoke token hiện tại
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      }).catch(() => {}); // Bỏ qua nếu token không tồn tại
    }
    return { message: 'Đăng xuất thành công' };
  }

  async logoutAllDevices(userId: number) {
    // Revoke tất cả token của user (dùng khi đổi mật khẩu hoặc nghi ngờ bị hack)
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return { message: 'Đã đăng xuất khỏi tất cả thiết bị' };
  }

  private async cleanupOldTokens(userId: number) {
    // Xóa token hết hạn, giữ tối đa 5 token active gần nhất
    await this.prisma.refreshToken.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } },
    });
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: { userId, revoked: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (activeTokens.length > 5) {
      const toDelete = activeTokens.slice(5).map(t => t.id);
      await this.prisma.refreshToken.deleteMany({ where: { id: { in: toDelete } } });
    }
  }

  async registerAdmin(dto: any) {
    const u = await this.userService.create({ ...dto, role: 'ADMIN' });
    return this.login({ sub: u.id }, u);
  }

  async registerInitialAdmin(dto: any) {
    const admins = await this.userService.findAll({ role: 'ADMIN' });
    if (admins?.length) throw new BadRequestException('Admin existed');
    return this.registerAdmin(dto);
  }

  async forgotPassword(dto: any) {
    const u = await this.userService.findByEmail(dto.email);
    if (!u) return { message: 'Reset link sent' };
    
    // Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Lưu mã OTP đã hash vào DB (dùng chung trường resetPasswordToken)
    await this.userService.updateResetToken(u.id, { 
      resetPasswordToken: await bcrypt.hash(otp, 10), 
      resetPasswordExpires: new Date(Date.now() + 600000).toISOString() // Hết hạn sau 10 phút
    });

    // Gửi email chứa mã OTP thay vì link
    await this.mailService.sendPasswordReset(dto.email, otp, u.name || undefined);
    return { message: 'OTP đã được gửi đến email của bạn.' };
  }

  async resetPassword(token: string, email: string, pass: string) {
    const u = await this.userService.findByEmail(email);
    if (!u?.resetPasswordToken || !u.resetPasswordExpires || new Date(u.resetPasswordExpires) < new Date() || !(await bcrypt.compare(token, u.resetPasswordToken))) throw new BadRequestException('Token invalid');
    await this.userService.resetPassword(u.id, pass);
    // Revoke tất cả refresh token sau khi đổi mật khẩu
    await this.logoutAllDevices(u.id);
    return { message: 'Success' };
  }

  setAuthCookie(res: any, t: string) { 
    res.cookie('access_token', t, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
      maxAge: 7200000 
    }); 
  }
  setRefreshTokenCookie(res: any, t: string) { 
    res.cookie('refresh_token', t, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000 
    }); 
  }
  clearAuthCookie(res: any) { 
    // Xóa tất cả các biến thể tên để đảm bảo không bị sót
    const cookiesToClear = ['access_token', 'accessToken', 'refresh_token', 'refreshToken'];
    cookiesToClear.forEach(c => res.cookie(c, '', { 
      maxAge: 0, 
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })); 
  }

  async getUserInfo(id: number) { return this.userService.findOne(id); }
  async getPermissionsByRole(role: string) { return this.userService.getPermissionsByRole(role); }
  async getAllPermissions() { return this.userService.getAllPermissions(); }
  async getRolesWithPermissions() { return this.userService.getRolesWithPermissions(); }
  async updateRolePermissions(role: string, pIds: number[]) { return this.userService.updateRolePermissions(role, pIds); }
}
