// src/auth/auth.controller.ts
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
} from '@nestjs/common';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RegisterDto } from './dto/register-dto';
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
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    
    // 🔒 Lưu token trong httpOnly cookie
    this.authService.setAuthCookie(res, result.access_token);
    
    // Không trả token trong response body (đã có trong cookie)
    res.status(HttpStatus.CREATED).json({
      user: result.user,
      message: 'User registered successfully'
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const result = await this.authService.login({ sub: user.id }, user);
    
    // 🔒 Lưu token trong httpOnly cookie
    this.authService.setAuthCookie(res, result.access_token);
    
    // Không trả token trong response body (đã có trong cookie)
    res.json({
      user: result.user,
      message: 'Login successful'
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res() res: Response) {
    this.authService.clearAuthCookie(res);
    res.json({ message: 'Logout successful' });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password/:token')
  @ApiOperation({ summary: 'Reset password form (GET for link)' })
  @ApiParam({ name: 'token', description: 'Reset token from email' })
  @ApiQuery({ name: 'email', description: 'Email user', required: true })
  resetPasswordForm(
    @Param('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    // Implementation needed
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 302, description: 'Redirect to Google' })
  googleAuth() {}

  @Get('google-login/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    
    const payload = { 
      sub: user.userId,
      email: user.email,
      role: user.role 
    };
    
    // ✅ Token expires in 7 days
    const token = this.jwtService.sign(payload, { 
      secret: process.env.JWT_SECRET,
      expiresIn: '7d' // ✅ Changed from '15m' to '7d'
    });
    
    // Set httpOnly cookie (7 days)
    this.authService.setAuthCookie(res, token);
    
    // Encode user data for URL
    const userDataString = JSON.stringify({
      id: user.userId,
      email: user.email,
      role: user.role,
    });
    const encodedUser = Buffer.from(userDataString).toString('base64');
    
    // Redirect to frontend with user data only (token in cookie)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?oauth_success=true&user_data=${encodedUser}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get current user info from token' })
  @ApiResponse({ status: 200, description: 'User info retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: any) {
    try {
      const user = req.user;
      const fullUser = await this.authService.getUserInfo(user.userId);
      if (!fullUser) {
        throw new Error('User not found');
      }
      const { password: _, ...safeUser } = fullUser;
      return safeUser;
    } catch (error) {
      throw error;
    }
  }
}