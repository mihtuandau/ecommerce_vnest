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

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';
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
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    this.authService.setAuthCookie(res, result.access_token);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'User registered successfully',
    });
  }

  @Post('register-admin')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto, @Res() res: Response) {
    const result = await this.authService.registerAdmin(registerAdminDto);
    this.authService.setAuthCookie(res, result.access_token);

    return res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'Admin registered successfully',
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const result = await this.authService.login({ sub: user.id }, user);

    this.authService.setAuthCookie(res, result.access_token);

    return res.json({
      user: result.user,
      message: 'Login successful',
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    this.authService.clearAuthCookie(res);
    return res.json({ message: 'Logout successful' });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password/:token')
  resetPasswordForm(
    @Param('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
  }

  @Post('reset-password')
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
      expiresIn: '7d',
    });

    this.authService.setAuthCookie(res, token);

    const encodedUser = Buffer.from(
      JSON.stringify({
        id: user.userId,
        email: user.email,
        role: user.role,
      }),
    ).toString('base64');

    const frontendUrl =
      process.env.FRONTEND_URL ;

    return res.redirect(
      `${frontendUrl}/?oauth_success=true&user_data=${encodedUser}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async getCurrentUser(@Req() req: any) {
    const fullUser = await this.authService.getUserInfo(req.user.userId);
    if (!fullUser) throw new Error('User not found');
    const { password: _, ...safeUser } = fullUser;
    return safeUser;
  }
}
