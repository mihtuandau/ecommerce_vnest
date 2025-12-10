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
            const token = request?.cookies?.access_token;return token;
          },
          // Fallback to Authorization header
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        ignoreExpiration: false,
        secretOrKey: configService.get('JWT_SECRET') || 'supersecret',
      });
    }

    async validate(payload: any) {const user = await this.userService.findOne(payload.sub);
      
      if (!user) {throw new UnauthorizedException('User not found');
      }return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }
  }