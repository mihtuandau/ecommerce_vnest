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
  @Throttle({ default: { limit: 50, ttl: 300000 } }) // Increased for dev (was 5 per 5 mins)
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    this.authService.setAuthCookie(res, result.access_token);
    this.authService.setRefreshTokenCookie(res, result.refresh_token);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'User registered successfully',
    });
  }

  @Post('register-admin/initial')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  async registerInitialAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res() res: Response,
  ) {
    // Private endpoint - only works if no admin exists yet
    const result = await this.authService.registerInitialAdmin(registerAdminDto);
    this.authService.setAuthCookie(res, result.access_token);
    this.authService.setRefreshTokenCookie(res, result.refresh_token);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Initial admin registered successfully',
    });
  }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  async registerAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.registerAdmin(registerAdminDto);
    this.authService.setAuthCookie(res, result.access_token);
    this.authService.setRefreshTokenCookie(res, result.refresh_token);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Admin registered successfully',
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 100, ttl: 300000 } }) // Increased for dev (was 5 per 5 mins)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const result = await this.authService.login({ sub: user.id }, user);

    this.authService.setAuthCookie(res, result.access_token);
    this.authService.setRefreshTokenCookie(res, result.refresh_token);

    return res.json({
      user: result.user,
      access_token: result.access_token,
      message: 'Login successful',
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    this.authService.clearAuthCookie(res);
    return res.json({ message: 'Logout successful' });
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }
    const result = await this.authService.refreshAccessToken(token);
    this.authService.setAuthCookie(res, result.access_token);
    return res.json({ access_token: result.access_token, message: 'Token refreshed' });
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
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
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
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

    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '2h', // 2 hours - same as login for consistency
    });

    this.authService.setAuthCookie(res, token);

    const permissions = await this.authService.getPermissionsByRole(user.role);

    const encodedUser = Buffer.from(
      JSON.stringify({
        id: user.userId,
        email: user.email,
        role: user.role,
        permissions: permissions,
      }),
    ).toString('base64');

    const frontendUrl = process.env.FRONTEND_URL;
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role?.toUpperCase());
    const redirectPath = isStaff ? '/admin-dashboard' : '/';

    return res.redirect(
      `${frontendUrl}${redirectPath}?oauth_success=true&user_data=${encodedUser}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async getCurrentUser(@Req() req: any) {
    const fullUser = await this.authService.getUserInfo(req.user.userId);
    if (!fullUser) throw new Error('User not found');
    const { password: _, ...safeUser } = fullUser;

    // Lấy permissions để trả về cho FE
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
}
