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
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL')?.trim() ||
      'http://localhost:5000/api/auth/google-login/callback';

    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')?.trim(),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')?.trim(),
      callbackURL,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
      userProfileURL: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails, displayName, photos, id, _json } = profile;
    const email = emails[0].value;

    // Lấy ảnh: Thử photos trước, sau đó thử _json.picture
    let avatar = photos?.[0]?.value || _json?.picture;

    if (avatar && avatar.includes('s96-c')) {
      avatar = avatar.replace('s96-c', 's400-c');
    }

    let user = await this.userService.findByEmail(email);

    const adminEmails = (this.configService.get('ADMIN_EMAILS') || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    const isAdminEmail = adminEmails.includes(email);

    const nameToSet =
      displayName || user?.name || email.split('@')[0] || 'Google User';

    if (!user) {
      user = await this.userService.createSocial({
        email,
        name: nameToSet,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        avatar: avatar,
        provider: 'GOOGLE',
        providerId: id,
      });
    } else {
      user = await this.userService.update(user.id, {
        name: user.name || nameToSet,
        avatar: avatar || user.avatar,
        provider: 'GOOGLE',
        providerId: id,
      } as any);
    }

    return { userId: user.id, email: user.email, role: user.role };
  }
}
