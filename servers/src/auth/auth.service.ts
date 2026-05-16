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

  async verifyOtp(email: string, code: string, deviceInfo?: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.verificationCode || !user.verificationExpires) {
      throw new BadRequestException('Mã xác thực không tồn tại hoặc đã hết hạn');
    }

    if (new Date() > user.verificationExpires) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) throw new BadRequestException('Mã xác thực không chính xác');

    // Activate user if pending
    const activatedUser = await this.prisma.user.update({
      where: { email },
      data: { 
        status: 'ACTIVE',
        verificationCode: null,
        verificationExpires: null
      },
    });

    return this.generateTokens(activatedUser, deviceInfo);
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
    if (!u || u.deletedAt) throw new UnauthorizedException('Thông tin không đúng.');
    
    // Nếu là tài khoản mạng xã hội và chưa đặt mật khẩu local
    if (u.provider !== 'LOCAL' && !u.password) {
      throw new UnauthorizedException(`Vui lòng đăng nhập bằng ${u.provider}`);
    }

    // Kiểm tra mật khẩu (đảm bảo u.password không null trước khi so sánh)
    if (!u.password || !(await bcrypt.compare(pass, u.password))) {
      throw new UnauthorizedException('Thông tin không đúng.');
    }

    if (u.status === UserStatus.PENDING) throw new UnauthorizedException('Chưa xác thực.');
    const { password: _, ...res } = u; return res;
  }

  async login(payload: any, info?: any, deviceInfo?: { ip?: string; userAgent?: string }) {
    const u = info || await this.userService.findOne(payload.sub);
    
    // Check if 2FA is enabled
    if (u.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      
      await this.prisma.user.update({
        where: { id: u.id },
        data: {
          verificationCode: hashedOtp,
          verificationExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
        }
      });

      await this.mailService.sendVerificationCode(u.email, otp, u.name || undefined);
      return { 
        requires2FA: true, 
        email: u.email,
        message: 'Tài khoản đã bật bảo mật 2 lớp. Vui lòng nhập mã xác thực gửi tới email.' 
      };
    }
    
    // Security check for new device
    if (deviceInfo && u.id) {
      this.checkNewDevice(u, deviceInfo).catch(err => console.error('New device check failed:', err));
    }

    const jti = crypto.randomBytes(16).toString('hex');
    const common = { sub: u.id, email: u.email, role: u.role };
    const refreshToken = this.jwtService.sign(
      { sub: u.id, jti },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    // Lưu hash của refresh token vào DB để có thể revoke
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: u.id,
        tokenHash,
        ipAddress: deviceInfo?.ip,
        userAgent: deviceInfo?.userAgent,
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

      // 1. Kiểm tra token có trong DB và chưa bị revoke
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Token đã hết hạn hoặc bị thu hồi');
      }

      // 2. TOKEN ROTATION: Revoke token cũ ngay lập tức (Sử dụng updateMany để tránh race condition)
      const updateResult = await this.prisma.refreshToken.updateMany({
        where: { id: stored.id, revoked: false },
        data: { revoked: true },
      });

      if (updateResult.count === 0) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
      }

      // 3. Tạo cặp token mới
      const u = await this.userService.findOne(p.sub);
      if (!u) throw new UnauthorizedException();

      // Thêm jti để đảm bảo tính duy nhất của refresh token ngay cả khi tạo cùng 1 giây
      const jti = crypto.randomBytes(16).toString('hex');
      const common = { sub: u.id, email: u.email, role: u.role };
      const newAccessToken = this.jwtService.sign(common, { secret: process.env.JWT_SECRET, expiresIn: '2h' });
      const newRefreshToken = this.jwtService.sign(
        { sub: u.id, jti },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      );

      // 4. Lưu token mới vào DB
      const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      await this.prisma.refreshToken.create({
        data: {
          userId: u.id,
          tokenHash: newTokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: stored.ipAddress,
          userAgent: stored.userAgent,
        },
      });

      await this.cleanupOldTokens(u.id);

      return { 
        accessToken: newAccessToken,
        refreshToken: newRefreshToken 
      };
    } catch { 
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ'); 
    }
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

  private async checkNewDevice(user: any, deviceInfo: { ip?: string; userAgent?: string }) {
    const { ip, userAgent } = deviceInfo;
    console.log(`[SecurityCheck] Checking login for User: ${user.email} | IP: ${ip}`);
    
    if (!ip || !userAgent) {
      console.log(`[SecurityCheck] Missing IP or UserAgent. IP: ${ip}, UA: ${userAgent}`);
      return;
    }

    // Check if this device has been used before in AuditLog
    const logs = await this.prisma.auditLog.findMany({
      where: {
        userId: user.id,
        action: 'LOGIN',
        ipAddress: ip,
      },
      take: 20,
    });

    console.log(`[SecurityCheck] Found ${logs.length} previous logins from this IP.`);

    const isNewDevice = !logs.some(log => (log.newData as any)?.userAgent === userAgent);
    console.log(`[SecurityCheck] Is new device: ${isNewDevice}`);

    // Create audit log for current login
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityName: 'User',
        entityId: String(user.id),
        ipAddress: ip,
        newData: { userAgent },
      },
    });

    if (isNewDevice) {
      // Check if security notifications are enabled
      let settings = user.notificationSettings;
      if (typeof settings === 'string') {
        try { settings = JSON.parse(settings); } catch (e) { settings = {}; }
      }
      
      const isSecurityEnabled = (settings as any)?.security !== false;
      console.log(`[SecurityCheck] Security Notifications Enabled: ${isSecurityEnabled}`);

      if (isSecurityEnabled) {
        console.log(`[SecurityCheck] Creating SECURITY notification for user ${user.id}`);
        // Create notification
        await this.prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Cảnh báo bảo mật',
            content: `Tài khoản của bạn vừa được đăng nhập từ một thiết bị hoặc trình duyệt mới. Nếu không phải bạn, hãy đổi mật khẩu ngay.`,
            type: 'SECURITY',
          },
        });
      }
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

  private getCookieOptions(maxAge: number) {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge,
    } as const;
  }

  setAuthCookie(res: any, t: string) { 
    res.cookie('accessToken', t, { 
      ...this.getCookieOptions(7200000),
    }); 
  }
  setRefreshTokenCookie(res: any, t: string) { 
    res.cookie('refreshToken', t, { 
      ...this.getCookieOptions(604800000),
    }); 
  }
  clearAuthCookie(res: any) { 
    const cookiesToClear = ['access_token', 'accessToken', 'refresh_token', 'refreshToken'];
    const isProduction = process.env.NODE_ENV === 'production';
    cookiesToClear.forEach(c => res.cookie(c, '', { 
      maxAge: 0, 
      path: '/',
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    })); 
  }

  async getUserInfo(id: number) { return this.userService.findOne(id); }
  async getPermissionsByRole(role: string) { return this.userService.getPermissionsByRole(role); }
  async getAllPermissions() { return this.userService.getAllPermissions(); }
  async getRolesWithPermissions() { return this.userService.getRolesWithPermissions(); }
  async updateRolePermissions(role: string, pIds: number[]) { return this.userService.updateRolePermissions(role, pIds); }

  async getSessions(userId: number) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    });
  }

  async revokeSession(userId: number, sessionId: number) {
    const session = await this.prisma.refreshToken.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) {
      throw new BadRequestException('Phiên đăng nhập không tồn tại');
    }
    return this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revoked: true },
    });
  }

  async toggle2FA(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (user.twoFactorEnabled) {
      // Disable 2FA
      await this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: false },
      });
      return { message: 'Đã tắt xác thực 2 lớp' };
    } else {
      // Send OTP to email to verify before enabling
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          verificationCode: hashedOtp,
          verificationExpires: new Date(Date.now() + 10 * 60 * 1000)
        }
      });

      await this.mailService.sendVerificationCode(user.email, otp, user.name || undefined);
      return { message: 'Mã xác thực đã được gửi tới email của bạn', requiresVerification: true };
    }
  }

  async verify2FAActivate(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.verificationCode || !user.verificationExpires) {
      throw new BadRequestException('Mã xác thực không hợp lệ');
    }

    if (new Date() > user.verificationExpires) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) throw new BadRequestException('Mã xác thực không chính xác');

    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        twoFactorEnabled: true,
        verificationCode: null,
        verificationExpires: null
      },
    });

    return { message: 'Đã bật xác thực 2 lớp thành công' };
  }

  async verify2FALogin(email: string, code: string, deviceInfo?: { ip?: string; userAgent?: string }) {
    return this.verifyOtp(email, code, deviceInfo);
  }

  private async generateTokens(u: any, deviceInfo?: { ip?: string; userAgent?: string }) {
    const jti = crypto.randomBytes(16).toString('hex');
    const common = { sub: u.id, email: u.email, role: u.role };

    const accessToken = this.jwtService.sign(common, {
      secret: process.env.JWT_SECRET,
      expiresIn: '2h',
    });

    const refreshToken = this.jwtService.sign(
      { sub: u.id, jti },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Security check for new device
    if (deviceInfo && u.id) {
      this.checkNewDevice(u, deviceInfo).catch((err) =>
        console.error('New device check failed:', err),
      );
    }

    await this.prisma.refreshToken.create({
      data: {
        userId: u.id,
        tokenHash,
        ipAddress: deviceInfo?.ip,
        userAgent: deviceInfo?.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      },
    });

    await this.cleanupOldTokens(u.id);

    return { accessToken, refreshToken, user: u };
  }
}
