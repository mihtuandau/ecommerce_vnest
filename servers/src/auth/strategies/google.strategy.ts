import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5000/api/auth/google-login/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, displayName } = profile;
    const email = emails[0].value;
    let user = await this.userService.findByEmail(email);
    
    // List of admin emails - should be moved to environment config
    const adminEmails = (this.configService.get('ADMIN_EMAILS') || '').split(',').map(e => e.trim()).filter(Boolean);
    const isAdminEmail = adminEmails.includes(email);
    
    if (!user) {
      user = await this.userService.create({
        email,
        name: displayName,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER', // ✅ Check if email is in admin list
        password: 'google-oauth', // Placeholder
      });
    }
    done(null, { userId: user.id, email: user.email, role: user.role });
  }
}
