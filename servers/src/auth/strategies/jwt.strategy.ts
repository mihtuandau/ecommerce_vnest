  // src/auth/strategies/jwt.strategy.ts
  import { ExtractJwt, Strategy } from 'passport-jwt';
  import { PassportStrategy } from '@nestjs/passport';
  import { Injectable, UnauthorizedException } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { UserService } from '../../user/user.service';
  import { Request } from 'express';

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private configService: ConfigService,
      private userService: UserService,
    ) {
      super({
        // ✅ Extract token từ Cookie HOẶC Authorization header
        jwtFromRequest: ExtractJwt.fromExtractors([
          // Try cookie first
          (request: Request) => {
            const token = request?.cookies?.access_token;
            console.log('🍪 Token from cookie:', token ? 'Found' : 'Not found');
            return token;
          },
          // Fallback to Authorization header
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        ignoreExpiration: false,
        secretOrKey: configService.get('JWT_SECRET') || 'supersecret',
      });
    }

    async validate(payload: any) {
      console.log('🔐 JWT Payload:', payload);
      
      const user = await this.userService.findOne(payload.sub);
      
      if (!user) {
        console.error('❌ User not found for ID:', payload.sub);
        throw new UnauthorizedException('User not found');
      }

      console.log('✅ User validated:', { id: user.id, email: user.email, role: user.role });
      
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }
  }