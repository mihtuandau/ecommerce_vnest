import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Query,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { RegisterDto } from './dto/register-dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyOtp(
    @Body() body: { email: string; code?: string; otp?: string },
    @Res() res: Response,
    @Req() req: any,
  ) {
    const code = body.code ?? body.otp;
    if (!code) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Verification code is required' });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    console.log(`[AuthGateway] Verify OTP for: ${body.email}`);
    const result = await this.authService.verifyOtp(body.email, code, { ip, userAgent });
    
    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }
    
    return res.json(result);
  }

  @Post('resend-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async resendOtp(@Body() body: { email: string }) {
    return this.authService.resendOtp(body.email);
  }

  @Post('register-admin/initial')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) 
  async registerInitialAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res() res: Response,
  ) {

    const result = await this.authService.registerInitialAdmin(registerAdminDto);
    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Initial admin registered successfully',
    });
  }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) 
  async registerAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.registerAdmin(registerAdminDto);
    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Admin registered successfully',
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) 
  async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: any) {
    console.log(`[AuthGateway] Login attempt for: ${loginDto.email}`);
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const result = await this.authService.login({ sub: user.id }, user, { ip, userAgent });

    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }
    
    return res.json(result);
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    await this.authService.logout(req.cookies?.refreshToken);
    this.authService.clearAuthCookie(res);
    return res.json({ message: 'Logout successful' });
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) 
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }
    const result = await this.authService.refreshAccessToken(token);
    this.authService.setAuthCookie(res, result.accessToken);
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    return res.json({ accessToken: result.accessToken, message: 'Token refreshed' });
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) 
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password/:token')
  resetPasswordForm(
    @Param('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {}

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) 
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google-login/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;

    console.log(`[AuthGateway] Google Auth Success for: ${user.email}`);
    const result = await this.authService.login({ sub: user.userId }, null, {
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    const origins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(o => o.trim());
    const frontendUrl = origins.find(o => o.includes('localhost')) || origins[0];

    if (result.requires2FA) {
      return res.redirect(`${frontendUrl}/auth/verify-2fa?email=${result.email}`);
    }

    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }

    console.log(`Google Auth Redirecting to: ${frontendUrl}`);
    const role = result.user?.role || user.role;
    const redirectPath = role === 'ADMIN' ? '/admin' : '/';
    return res.redirect(`${frontendUrl}${redirectPath}?auth_success=true`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async getCurrentUser(@Req() req: any) {
    const fullUser = await this.authService.getUserInfo(req.user.userId);

    const safeUser = {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      phone: fullUser.phone,
      avatar: fullUser.avatar,
      role: fullUser.role,
      status: fullUser.status,
      createdAt: fullUser.createdAt,
      updatedAt: fullUser.updatedAt,
      addresses: fullUser.addresses,
    };

    const permissions = await this.authService.getPermissionsByRole(safeUser.role);

    return {
      ...safeUser,
      permissions,
    };
  }

  @Get('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllPermissions() {
    return this.authService.getAllPermissions();
  }

  @Get('roles-permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRolesWithPermissions() {
    return this.authService.getRolesWithPermissions();
  }

  @Post('roles-permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRolePermissions(@Body() body: { role: string; permissionIds: number[] }) {
    return this.authService.updateRolePermissions(body.role, body.permissionIds);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Req() req: any) {
    return this.authService.getSessions(req.user.userId);
  }

  @Post('sessions/revoke')
  @UseGuards(JwtAuthGuard)
  async revokeSession(@Body() body: { sessionId: number }, @Req() req: any) {
    return this.authService.revokeSession(req.user.userId, body.sessionId);
  }

  @Post('2fa/toggle')
  @UseGuards(JwtAuthGuard)
  async toggle2FA(@Req() req: any) {
    return this.authService.toggle2FA(req.user.userId);
  }

  @Post('2fa/verify-activate')
  @UseGuards(JwtAuthGuard)
  async verify2FAActivate(@Body() body: { code: string }, @Req() req: any) {
    return this.authService.verify2FAActivate(req.user.userId, body.code);
  }

  @Post('2fa/verify-login')
  async verify2FALogin(
    @Body() body: { email: string; code: string },
    @Res() res: Response,
    @Req() req: any
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.verify2FALogin(body.email, body.code, { ip, userAgent });

    if (result.accessToken && result.refreshToken) {
      this.authService.setAuthCookie(res, result.accessToken);
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
    }
    return res.json(result);
  }
}
